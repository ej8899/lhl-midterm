//
//  LightHouseLabs.ca - Mid Term Project
//  front end javascript, html, css by Ernie Johnson
//
//

//
// Setup GLOBAL variables
//
let currentMap = 1; // what is the current map ID being viewed?
let currentUID = 0; // what is the current USER ID (0 not logged in, else db user id)

// global vars for GOOGLE MAP API and other cached database info
let map,mapBounds,mapMarkers,markersArray;
const mapsKey = 'AIzaSyCfRtVUE5xGwJE6CABUHU7P_IZsWdgoK_k';

// GLOBAL cached DB query data
let mapsList, mapsListObject, mapsPointsObject;



//
// Initial setup/loading items
//
const main = function() {
  // get user position so we can center the  map
  let getPosition = {
    enableHighAccuracy: false,
    timeout: 9000,
    maximumAge: 0
  };
  function success(gotPosition) {
    let uLat = gotPosition.coords.latitude;
    let uLon = gotPosition.coords.longitude;
    console.log(`${uLat}`, `${uLon}`);
    mapMoveToLocation(uLat,uLon);
  };
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  navigator.geolocation.getCurrentPosition(success, error, getPosition);



};
main();


//
// actions for Document Ready loading
//
$(document).ready(function() {
  reqLocationModal();
  updateNav();
  getListofMaps();

  sliderToggle();

  // setup "back to top" scroll button & deal with the scrolling
  $('.back-top').hide();
  $('#back-top').click(function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
  $(window).on("scroll", function() {
    // Show & Hide Back To Top Button
    if ($(window).scrollTop() > 300) {
      $('.back-top').removeClass("fadeout");
      $('.back-top').show();
    } else {
      if (!$('#back-top').hasClass("fadeout")) {
        $('.back-top').addClass("fadeout");
        setTimeout(function() {
          $('.back-top').hide();
        }, 2300);
      }
    }
  });

  // handle map select drop down
  $('.dropdown-el').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).toggleClass('expanded');
    $('#'+$(e.target).attr('for')).prop('checked',true);
  });
  $(document).click(function() {
    $('.dropdown-el').removeClass('expanded');
  });

}); // END DOCUMENT READY


//
// sliderToggle() - this toggles info sliders open & closed
//
const sliderToggle = function() {
  // uncomment next two lines to start with first block open
  // $('.toggle-block:first-child').addClass('active');
  // $('.toggle-block:first-child').find('.toggle-able').slideToggle();
  $('.toggle-trigger').click(function() {
    $(this).closest('.toggle-block').toggleClass('active');
    $(this).closest('.toggle-block').find('.toggle-able').stop().slideToggle();
  })
}

//
//  toggleDarkMode(option);
//  toggle to switch classes between .light and .dark
//  if no class is present (initial state), then assume current state based on system color scheme
//  if (option) is "check", we're assuming initial load state and checking localStorage for a saved state from prior use
//
const toggleDarkMode = function(option) {
  // internal helper functions:
  const addDark = () => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    $("#dayicon").addClass("darkmodeIconVisible");
    $("#dayicon").removeClass("darkmodeIconInvisible");
    $("#nighticon").removeClass("darkmodeIconVisible");
    $("#nighticon").addClass("darkmodeIconInvisible");
  };
  const addLight = () => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    $("#dayicon").addClass("darkmodeIconInvisible");
    $("#dayicon").removeClass("darkmodeIconVisible");
    $("#nighticon").addClass("darkmodeIconVisible");
    $("#nighticon").removeClass("darkmodeIconInvisible");
  };

  // check localStorage to see if we have a dark preference & apply theme if so
  if (option === 'check') {
    if (localStorage.getItem('isDarkMode') === 'true') {
      $('#darkmodeswitch').prop('checked', true);
      setTimeout(() => {    // fake delay IS required here
        addDark();
      }, 0);
      setTimeout(() => {    // minimize 'flash' when initially loading page
        $('body').css('transition', 'all .3s ease-in');
      }, 10);
    } else {
      addLight();
    }
    // remove any flash as we've hidden the page initially - BUT also needs transitions OFF (we add above after load)
    $('body').css('visibility','visible');
    $('body').css('opacity','1');
    return;
  }

  // toggle themes
  if (document.documentElement.classList.contains("light")) {
    addDark();
  } else if (document.documentElement.classList.contains("dark")) {
    addLight();
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      addDark();
    } else {
      addLight();
    }
  }
  // save our preference for next time here
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem('isDarkMode',true);  // https://blog.logrocket.com/localstorage-javascript-complete-guide/
  } else {
    localStorage.removeItem('isDarkMode');
  }
};
toggleDarkMode('check');





const mapSelectHandler = function() {
  $(".custom-select").each(function() {
    let classes = $(this).attr("class"),
        id      = $(this).attr("id"),
        name    = $(this).attr("name");
    let template =  '<div class="' + classes + '">';
        template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="custom-options">';
        $(this).find("option").each(function() {
          template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
    template += '</div></div>';

    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });
  $(".custom-option:first-of-type").hover(function() {
    $(this).parents(".custom-options").addClass("option-hover");
  }, function() {
    $(this).parents(".custom-options").removeClass("option-hover");
  });
  $(".custom-select-trigger").on("click", function() {
    $('html').one('click',function() {
      $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
  });
  $(".custom-option").on("click", function() {
    $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
    let mapChangeID = $("#map-sources").val();
    console.log("MAP CHANGE:",mapChangeID);
    if(mapChangeID === "newmap") {
      newMapModal();
      return;
    }
    currentMap = mapChangeID;
    getPointsByMap(mapChangeID);
    $("#titlemap").text($(this).text());
    $("#aboutmap").text(findMapDescription(mapChangeID));
  });
}

// find map descriptions in our map list object
const findMapDescription = function(mapID) {
  let mapDescription = 'Map My Wiki';
  // mapsListObject[x].description
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.description;
    }
  }
  return mapDescription;
}

const updateNav = function(user) {
  // update the nav bar if logged in or not
  const $pageHeader = $('#page-navbar');
  $pageHeader.find("#navbar-userlinksend").remove();
  let userLinks;

  let fixedItems = `<span style="padding-right:6px" class="tooltip expand" data-title="latest version on github"><a href="https://github.com/ej8899/lhl-midterm" target="new"><i class="fa-brands fa-github fa-lg"></i></a></span>

  <div class="switchcontainer tooltip expand" data-title="toggle light & dark mode"><i class="fa-solid fa-sun darkicon" id="dayicon"></i>&nbsp;<input type="checkbox" class="toggle" unchecked style="min-height: 22px; height:22px !important;" onclick="toggleDarkMode();" id="darkmodeswitch"><i class="fa-solid fa-moon darkicon" id="nighticon" style="padding-left:6px"></i></div>`;
  if (!user) {
    userLinks = `
    <nav id="navbar-userlinksend" class="navbar-userlinksend">
      <button class="login_button " onClick="showLogin();">Log In</button>
      <button class="sign-up_button " onClick="showSignUp();">Sign Up</button>
      ${fixedItems}
    </nav>
    `
  } else {
    userLinks = `
    <nav id="navbar-userlinksend" class="navbar-userlinksend">
    <button class="login_button " onClick="logOut();updateNav();">Log Out ( ${user.name} )</button>
    ${fixedItems}
    </nav>
    `
  }
  $pageHeader.append(userLinks);
}

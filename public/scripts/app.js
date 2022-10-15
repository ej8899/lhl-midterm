//
//  LightHouseLabs.ca - Mid Term Project
//  front end javascript, html, css by Ernie Johnson
//
//

//
// Setup GLOBAL variables
//
let currentMap = 1; // what is the current map ID being viewed?
let currentUID = 1; // what is the current USER ID (0 not logged in, else db user id)

// global vars for GOOGLE MAP API and other cached database info
let map,mapBounds,mapMarkers,markersArray;
const mapsKey = 'AIzaSyCfRtVUE5xGwJE6CABUHU7P_IZsWdgoK_k';

// GLOBAL cached DB query data
let mapsList, mapsListObject;



//
// Initial setup/loading items
//

const main = function() {
  getListofMaps();
};
main();


//
// Any actions for Document Ready processing
//
$(document).ready(function() {

  // setup for SEARCH modal button
  $('#filtertoggleicon').click(function() {
    // main search & filter button
  });

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

  // populate map drop down list
  // load list of all maps available
  // TODO need this as separate function to REFRESH on map list change
  console.log("MAPSLIST: ",mapsList)
  let x = 0;
  for (const map of mapsList) {
    $("#map-sources").append(`<option value="${x}" class="selectmap">${map}</option>`);
    x ++;
    //<option value="profile">Profile</option>
  }
  // TODO - now we have to call the map drop down process to refresh handlers on it


  //
  // select a map custom dropdown
  // try this one: https://codepen.io/yy/pen/vOYqYV
  // or https://codepen.io/udyux/pen/KzJQea

  // TODO drop down list needs a listener so we switch map data
  mapSelectHandler();

  // default populate the map with map #1 data
  console.log(getPointsByMap(1));


  placeMarker({lat:50.9223039,lng:-113.9328659},"home","prov item"); // location is object lat: lng:
  placeMarker({lat:50.923823,lng:-113.932970},"tims","prov item"); // location is object lat: lng:


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


}); // END DOCUMENT READY






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
    $("#aboutmap").text(mapsListObject[mapChangeID].description);
    // DEBUG console.log(mapsListObject[mapChangeID].description);
  });
}

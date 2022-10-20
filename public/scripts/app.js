//
//  LightHouseLabs.ca - Mid Term Project
//  front end javascript, html, css by Ernie Johnson
//
//

//
// Setup GLOBAL variables
//
let currentMap = 1;     // what is the current map ID being viewed?
let currentUID = 0;     // what is the current USER ID (0 not logged in, else db user id)
let gConfirmation = 0;  // global confirmation variable 0 = no, 1 = yes

// global vars for GOOGLE MAP API and other cached database info
let map,mapBounds,mapMarkers,markersArray;
const mapsKey = 'AIzaSyCfRtVUE5xGwJE6CABUHU7P_IZsWdgoK_k';

// GLOBAL cached DB query data
let mapsList, mapsListObject, mapsPointsObject, favoritesObject, gCurrentMapId, userPointCache;



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
  favoriteHandler();

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
// add click handler to favorite/heart icon on map
//
const favoriteHandler = function() {
  $("#favoritestatus").on("click", function() {
    updateFavSatus();
  });
};
// updator for fav status - call when map changes, etc to update admin area and heart icons
const updateFavSatus = function() {
  let favoritestatus = 0;
  for (const key in favoritesObject) {
    if(+currentMap == +favoritesObject[key].map_id) {
      // toggle fav OFF
      $('#favoritestatus').removeClass('fa-solid');
      $('#favoritestatus').addClass('fa-regular');
      deleteFav(currentMap);
      favoritestatus = 1;
    }
  }
  if (favoritestatus === 0) {
    // toggle fav ON
    $('#favoritestatus').addClass('fa-solid');
    $('#favoritestatus').removeClass('fa-regular');
    setFav(currentMap);
  }
};
// check favorites icon for proper status
const updateFavIcon = function() {
  let favoritestatus = 0;
  for (const key in favoritesObject) {
    if(+currentMap == +favoritesObject[key].map_id) {
      // toggle fav ON
      $('#favoritestatus').addClass('fa-solid');
      $('#favoritestatus').removeClass('fa-regular');
      favoritestatus = 1;
    }
  }
  if(favoritestatus === 0) {
    $('#favoritestatus').removeClass('fa-solid');
    $('#favoritestatus').addClass('fa-regular');
  }
}

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
  let svg1 = `<svg style="height:20px;width:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#505050ff" d="`;
  let svg2 = `"/></svg>`;
  let mapIcon;
  let defaultMapIcon = "M384 476.1L192 421.2V35.9L384 90.8V476.1zm32-1.2V88.4L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3V394.6c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2V423.6L32.9 474.5C17.1 480.8 0 469.2 0 452.2V117.4c0-9.8 6-18.6 15.1-22.3z";

  $(".custom-select").each(function() {
    let classes = $(this).attr("class"),
        id      = $(this).attr("id"),
        name    = $(this).attr("name");
    let template =  '<div class="' + classes + '">';
        template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="custom-options">';
        $(this).find("option").each(function() {
          mapIcon = findMapIcon($(this).attr("value"));
          if(!mapIcon) {
            mapIcon = defaultMapIcon;
          }
          template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + svg1 + mapIcon + svg2 + '&nbsp;&nbsp;' + $(this).html() + '</span>';
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
    console.log("MAP CHANGE - the map ID:",mapChangeID);
    if(mapChangeID === "newmap") {
      newMapModal();
      return;
    }
    currentMap = mapChangeID;
    getPointsByMap(mapChangeID);
    updateFavIcon();
    $("#titlemap").text($(this).text().trim());
    $("#aboutmap").text(findMapDescription(mapChangeID).trim());
  });
};

// pre-fetch images for quicker loading
const cacheImages = function(mapId) {
  let img = [], x = 0;
  if(!mapsPointsObject) {
    // problem, let's get out of here
    return;
  }
  for (const key of mapsPointsObject) {
    console.log("PREFETCH:",key.image_url)
    img[x] = new Image();
    img[x].src = key.image_url;
  };
}

// fake a click or tap on map select list to ensure everything stays in sync
const switchMap = function(mapId) {
  // map select handler has process for switching maps, so lets simulate a click on the map
  let selectItem = $(`[data-value="${mapId}"]`);
  selectItem.trigger("click");
};

// find map descriptions in our map list object
const findMapDescription = function(mapID) {
  let mapDescription = 'Create your own wiki - mapped!';
  // mapsListObject[x].description
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.description;
    }
  }
  return mapDescription;
};

// find map title in our map list object
const findMapTitle = function(mapID) {
  let mapDescription = 'Map My Wiki';
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.name;
    }
  }
  return mapDescription;
};

// find (& return) entire map object in our map list object
const findMapObject = function(mapID) {
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key;
    }
  }
  return null;
};

// find map owner in our map list object
const findMapOwnerId = function(mapID) {
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.owner_id;
    }
  }
  return null;
};

// find map PIN data in our map list object
const findMapPinData = function(mapID) {
  let pinData ='';
  // mapsListObject[x].description
  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.map_pins;
    }
  }
  return pinData;
};

// find and return the map pin (SVG) if included in a map
const findMapIcon = function(mapID) {
  // plus icon
  //let mapIcon = `M320 144c0 79.5-64.5 144-144 144S32 223.5 32 144S96.5 0 176 0s144 64.5 144 144zM176 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM144 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z`;
  let mapIcon = `M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z`;

  for (const key of mapsListObject) {
    if(key.id === +mapID) {
      return key.map_pins;
    }
  }
  return mapIcon;
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
};

const editPinFromMap = function(pinId) {

};

const editPin = function(pin) {
  console.log("FINDPOINTINCACHE:",findPointinCache(pin))
  // find the pin - is it current user owned:
  if(findPointinCache(pin)) {
    editPinModal(findPointinCache(pin));
  } else {
    alert("map owned")
    // check the map point cache instead of owner cache
    editPinModal(findPointinMapsPointCache(pin));
  }
  // find the pin - is it map owner 'owned':


  //editPinModal(findPointinCache(pin));
};
const findPointinMapsPointCache = function(pin) {
  for (const key of mapsPointsObject) {
    if(key.id === +pin) {
      console.log ("POINT OBJECT:",key)
      return key;
    }
  }
};

const findPointinCache = function(pin) {
  // points cache for this user is at userPointCache
  for (const key of userPointCache) {
    if(key.id === +pin) {
      console.log ("POINT OBJECT:",key)
      return key;
    }
  }
};

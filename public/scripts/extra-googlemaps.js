//
//  google mapping of properties
//
// global vars for GOOGLE MAP API and other cached database info
let map,mapBounds,mapMarkers,markersArray;
const mapsKey = 'AIzaSyCfRtVUE5xGwJE6CABUHU7P_IZsWdgoK_k';

// https://www.w3schools.com/graphics/google_maps_reference.asp
// https://developers.google.com/maps/documentation/javascript/examples
const initMap = function() {
  markersArray = [];          // array to hold the map markers

  const clearOverlays = function() {
    //function to clear the markers from the arrays, deleting them from the map
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  };

  let mapProp = {                                     // setup initial map display
    center:new google.maps.LatLng(53.5, -104.0),      // center of (roughly canada centered)
    zoom:4,
    mapTypeControlOptions: { mapTypeIds: [] },
    streetViewControl: false,
    fullscreenControl: false,
  };

  map = new google.maps.Map(document.getElementById("map"), mapProp);
  mapBounds = new google.maps.LatLngBounds();
};

window.initMap = initMap;

//
// placeMarker(location,city,province) where location is object of lat/lng for maps API
//
const placeMarker = function(location,city,prov) {
  // CUSTOM icon for LightBNB (bed icon)
  let iconBase = {
    path: "M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zM176 288c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z",
    strokeWeight: 0,
    scale: 0.05,
  };
  let icon = {
    ...iconBase,
    fillColor: '#CA4246',
    fillOpacity: 0.8,
  };
  let iconDark = {
    ...iconBase,
    fillColor: '#505050',
    fillOpacity: 1.0,
  };

  //
  //  check for existing marker here - if so, just return so we're not doing useless work, or burdening map displays
  //
  for (let x = 0; x < markersArray.length; x++) {
    let tempString = JSON.stringify(markersArray[x].getPosition());
    if (tempString !== undefined) {
      let tempLoc = JSON.parse(tempString);
      if (location.lat === tempLoc.lat) {
        if (location.lng === tempLoc.lng) {
          return;
        }
      }
    }
  }

  //
  // place marker code --  adds marker to passed in location
  //
  let marker = new google.maps.Marker({
    position: location, // position: is object of {lat: lng:}
    map: map,
    animation: google.maps.Animation.DROP,
    icon: icon,
    //title: city, // title is default for maps hover/tooltip tag - don't use it to keep the hover tooltip "off"
    mytitle: city, // we can use our own defined options like this one
    myprov: prov,
  });
  markersArray.push(marker);        //adds new marker to the markers array
  mapBounds.extend(marker.position);
  map.setOptions({maxZoom: 15});
  //map.fitBounds(mapBounds);
  google.maps.event.addListenerOnce(map, "idle", function() {
    if (map.getZoom() > 16) map.setZoom(16);
  });

  //
  // add info window for each marker:
  //

  /*
  // get total count of properties per city
  let tempCount;
  getCountbyCity(city)
    .then(function(json) {
      tempCount = JSON.parse(JSON.stringify(json.properties.count));
      //console.log('count for ' + city + ':' + tempCount);
    })
    .catch((error) => {
      console.log('error occured: ' + error.message);
    })
    .then(() => { // "always" component of then.catch.promises
      const infoWindowData = `<div class="map-infobox-wrapper"><div><i class="fa-solid fa-magnifying-glass fa-xlg" style="color: #FF4433 "></i></div><div class="map-infobox-content"><B>${city} - ${tempCount} listings.</B><Br><small> click or tap to search this city</small></div></div>`;
      // more on infoWindow here: https://developers.google.com/maps/documentation/javascript/infowindows
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowData,
      });

      //  MOUSE OVER MARKER handler - adds and removes styles as necessary
      marker.addListener('mouseover', function() {
        //console.log(tempCount)
        this.setIcon(iconDark);
        infoWindow.open(map, this);
        let iwContainer = $(".gm-style-iw").parent();
        iwContainer.stop().hide();
        iwContainer.fadeIn(500);
      });

      // mouse OUT of MARKER handler
      marker.addListener('mouseout', function() {
        this.setIcon(icon);
        infoWindow.close();
      });

      //
      // LEFT BUTTON CLICK listener on each MARKER
      //
      google.maps.event.addListener(marker, 'click', function() {
        //let citysearch = this.getTitle(); // this is a built in getter for marker object title element
        let citysearch = this.get('mytitle'); // we can do this get get our own marker object items
        let theprov = this.get('myprov');
        googlePlaceSearch(citysearch,theprov);
        getAllListings(`city=${citysearch}`)
          .then(function(json) {
            propertyListings.addProperties(json.properties);
            views_manager.show('listings');
          });
      });
    });
    */
};


//
// clearMapMarkers() - clear markers from arrays and thusly map
//
const clearMapMarkers = function() {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
};



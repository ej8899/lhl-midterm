//
//  google mapping of properties
//


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
    zoom:13,
    mapTypeControl: true,
    //mapTypeControlOptions: { mapTypeIds: ['ROADMAP','SATELLITE','HYBRID'] },
    streetViewControl: false,
    fullscreenControl: false,
  };

  map = new google.maps.Map(document.getElementById("map"), mapProp);
  mapBounds = new google.maps.LatLngBounds();

  // general MAPS click event handler
  google.maps.event.addListener(map, 'click', function( event ){
    //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() );
    newPin(event.latLng.lat(),event.latLng.lng());
  });
};

window.initMap = initMap;

//
// placeMarker(location,city,province) where location is object of lat/lng for maps API
//
const placeMarker = function(location,city,prov) {
  // custom ICONS for map pins:
  let iconDefault = {
    path: "M320 144c0 79.5-64.5 144-144 144S32 223.5 32 144S96.5 0 176 0s144 64.5 144 144zM176 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM144 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z",
    strokeWeight: 0,
    scale: 0.05,
  };
  let iconCoffee = {
    path: "M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zM32 192c-17.7 0-32 14.3-32 32V416c0 53 43 96 96 96H288c53 0 96-43 96-96h16c61.9 0 112-50.1 112-112s-50.1-112-112-112H352 32zm352 64h16c26.5 0 48 21.5 48 48s-21.5 48-48 48H384V256zM224 24c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C232.5 112.3 240 119.9 240 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C231.5 47.7 224 40.1 224 24z",
    strokeWeight: 0,
    scale: 0.05,
  };
  let iconBurger = {
    path: "M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16zm240 16c8.8 0 16-7.2 16-16s-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16zM272 96c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z",
    strokeWeight: 0,
    scale: 0.05,
  };
  let iconDrinks = {
    path: "M432 240c53 0 96-43 96-96s-43-96-96-96c-35.5 0-66.6 19.3-83.2 48H296.2C316 40.1 369.3 0 432 0c79.5 0 144 64.5 144 144s-64.5 144-144 144c-27.7 0-53.5-7.8-75.5-21.3l35.4-35.4c12.2 5.6 25.8 8.7 40.1 8.7zM1.8 142.8C5.5 133.8 14.3 128 24 128H392c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-177 177V464h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H208 120c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V345.9L7 169c-6.9-6.9-8.9-17.2-5.2-26.2z",
    strokeWeight: 0,
    scale: 0.05,
  };

  // TODO - remove this once we have food specific icons ready to use and test ok
  let iconBase = {
    path: "M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zM176 288c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z",
    strokeWeight: 0,
    scale: 0.05,
  };
  let icon = {
    ...iconDefault,
    fillColor: '#CA4246',
    fillOpacity: 1.0,
  };
  let iconDark = {
    ...iconDefault,
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
    itemTitle: city, // we can use our own defined options like this one
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

  const infoWindowData = `<div class="map-infobox-wrapper"><div><i class="fa-solid fa-magnifying-glass fa-xlg" style="color: #FF4433 "></i></div><div class="map-infobox-content"><B>${city} listings.</B><Br><small> click or tap to search this city</small></div></div>`;
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
    let itemTitle = this.get('itemTitle');
    toggleModal('modal window for map item',itemTitle);
  });

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

//
// mapMoveToLocation = function(lat,long)
//
const mapMoveToLocation = function(lat,lng) {
  const center = new google.maps.LatLng(lat, lng);
  map.panTo(center);
}

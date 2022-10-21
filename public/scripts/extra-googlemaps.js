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
    if (currentUID > 0) {
      // check if private map - if so, owner has to be current user
      let currentmap = findMapObject(currentMap);
      if (currentmap.is_private === true) {
        //is owner the user
        if(currentUID != currentmap.owner_id) {
          modalError('This is a private map, you need to be the owner to add pins!');
          return;
        }
      }

      console.log("CURRENT MAP:",currentMap)
      newPin(event.latLng.lat(),event.latLng.lng());
    } else if (currentUID === 0) {
      showLogin();
    } else {
      modalError('Please select a map before trying to add points!');
    }
  });
};

window.initMap = initMap;

//
// placeMarker(location,city,province) where location is object of lat/lng for maps API
//
const placeMarker = function(location,city,prov,itemObjectNumber) {
  // custom ICONS for map pins:
  let iconDefault = {
    path: "M320 144c0 79.5-64.5 144-144 144S32 223.5 32 144S96.5 0 176 0s144 64.5 144 144zM176 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM144 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z",
    strokeWeight: 0,
    scale: 0.05,
  };

  const newPinPath = findMapPinData(currentMap);
  if(newPinPath) {
    iconDefault.path = newPinPath;
  }
  /*
  if (mapsListObject[currentMap].map_pins) {
    iconDefault.path = mapsListObject[currentMap].map_pins;
  }
  */
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
    myitemnumber: itemObjectNumber,
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
  const infoWindowData = `<div class="map-infobox-wrapper"><div><i class="fa-solid fa-magnifying-glass fa-xlg" style="color: #FF4433 "></i></div><div class="map-infobox-content"><B>${city}.</B><Br><small> click or tap to view details</small></div></div>`;
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
  // LEFT BUTTON CLICK listener on each MARKER for detailed item view
  //
  google.maps.event.addListener(marker, 'click', function() {
    let pointNumber = this.get('myitemnumber');
    let itemTitle = this.get('itemTitle');
    let imageURL = mapsPointsObject[pointNumber].image_url;
    let adminOptions = '';

    // TODO - deal with map owner and pin owners
    // if current user is same as this point contributor - OR map owner, allow for DELETE button/icon
    // check if map owner
    // if mapslistobject of current map has owner_id = currentUID then ok to edit.
    let adminEdit = 0;
    const mapOwner = findMapOwnerId(currentMap);
    if (mapOwner === currentUID) {
      adminEdit = 1;
    }
    if (currentUID === mapsPointsObject[pointNumber].contributor_id) {
      adminEdit = 1;
    }

    if (adminEdit === 1) {
      // show trash icon and edit icons
      adminOptions += `<br clear=all><hr><a onclick="deletePin(${mapsPointsObject[pointNumber].id});toggleModal();"; class="tooltip expand" data-title="delete this point"><i class="fa-solid fa-trash fa-xl"></i></a> | <a onclick="editPin(${mapsPointsObject[pointNumber].id});toggleModal();" class="tooltip expand" data-title="edit this point"><i class="fa-solid fa-pen-to-square fa-xl"></i></a>`;
    }

    let contributorname ='';
    if(mapsPointsObject[pointNumber].contributor_name) {
      contributorname = "Added by: " + mapsPointsObject[pointNumber].contributor_name;
    }

    if (!imageURL) {
      imageURL = './images/missingimage.png';
    } else {
      checkImage(imageURL,'#modalimage');
    }
    let itemDescription = `
      ${mapsPointsObject[pointNumber].description}<BR><BR clear=all>
      <section class="property-listing__preview-image"><center>
      <img src="${imageURL}" alt="${itemTitle}" class="imgthumb" id="modalimage">
      <center></section>
      ${contributorname}
      ${adminOptions}
    `;

    toggleModal(itemTitle,itemDescription,null,{"background":"white"});
  });

};

//
// checkImage()
// check if image is valid at detination URL - if not, use a built in "missing image" to prevent broken image link
//
const checkImage = (url,id) => {
  let image = new Image();
  image.onload = () => { // image DOES exist
    if (this.width > 0) {
      // unhide each id if we setup for lazy load of images
      $(id).attr("src",url);
    }
  };
  image.onerror = () => { // image does NOT exist
    $(id).attr("src","./images/missingimage.png");
  };
  image.src = url; // NOTE: set SRC after the onload event: https://stackoverflow.com/questions/7434371/image-onload-function-with-return
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
  console.log("MOVING MAP: ",lat,lng)
  const center = new google.maps.LatLng(lat, lng);
  map.panTo(center);
}



//
// resetMapData(mapID)
//
const resetMapData = function(mapID) {
  clearMapMarkers();
  getPointsByMap(mapID);
  // plot points
  //placeMarker({lat:50.9223039,lng:-113.9328659},"home","prov item"); // location is object lat: lng:
  for (const key in mapsPointsObject) {
    placeMarker({lat:key.latitude,lng:key.longitude},key.title,key.description);
  }
  // reset zoom level
}

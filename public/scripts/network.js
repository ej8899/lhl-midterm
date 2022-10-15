function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/api/users/logout",
  })
}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/login",
    data
  });
}

function signUp(data) {
  return $.ajax({
    method: "POST",
    url: "/users",
    data
  });
}

function getPointsByMap(mapID) {
  //return pointsData[1];
  getPointsByMapAPI(mapID)
    .then(function(json) {
      clearMapMarkers();
      console.log("POINTS LIST:",json.points);

      mapsPointsObject = json.points;
      let x = 0;
      for (const key of mapsPointsObject) {
        console.log(key.title)
        placeMarker({lat:+key.latitude,lng:+key.longitude},key.title,key.description,x);
        x ++;
      }
      mapMoveToLocation(+json.points[0].latitude,+json.points[0].longitude);
    });
}
function getPointsByMapAPI(params) {
  let url = "/api/widgets/points";
  if (params) {
    url += "?mapId=" + params;
  }
  return $.ajax({
    url,
  });
}

//
// get all our public maps and cache the data
//
function getListofMaps() {
  let mapNames=[];
  getListofMapsAPI().then(function(json) {
    console.log(json.maps)
    for(element in json.maps) {
      mapNames.push(json.maps[element].name);
      //console.log(json.maps[element].name)
    }
    //console.log(mapNames)
    mapsList = mapNames;
    mapsListObject = json.maps;
    // refresh the maps list here

    //console.log("MAPSLIST: ",mapsList)
    for (const map in mapsListObject) {
      console.log("MAP:",map)
      console.log("MAP NAME:",mapsListObject[map].name)
      $("#map-sources").append(`<option value="${mapsListObject[map].id}" class="selectmap">${mapsListObject[map].name}</option>`);
    }
    mapSelectHandler();
  });
}
function getListofMapsAPI() {
  let url = "/api/widgets/no-private-maps";
  return $.ajax({
    url,
  });
}



// extrastretch items
function getCountbyCity(params) {
  let url = "/api/getcountbycity";
  if (params) {
    url += "?city=" + params;
  }
  return $.ajax({
    url,
  });
}
function getCountbyProv(params) {
  let url = "/api/getcountbyprov";
  if (params) {
    url += "?province=" + params;
  }
  return $.ajax({
    url,
  });
}
function getAllListings(params) {
  let url = "/api/properties";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
}


const submitNewMap= function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/widgets/maps",
    data,
  });
};

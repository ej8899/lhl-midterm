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
  return pointsData[1];
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
      console.log(json.maps[element].name)
    }
    console.log(mapNames)
    mapsList = mapNames;
    mapsListObject = json.maps;
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

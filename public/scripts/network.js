
function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
}

function logOut() {
  $('#useronlysection').css('visibility','hidden');
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


const fetchFavorites = function() {
  getFavoritesAPI(currentUID)
  .then(function(json) {
    console.log("FAVORITES OBJ:",json.favourites);
    console.log("FAV COUNT:",json.favourites.length);
    if(json.favourites.length > 0) {
      let userfavSection = `<table border="0" width="100%">`;
      userfavSection += '<tr><td width=100%>';
      userfavSection += json.favourites[0].description;
      // TODO - make the heart toggle fav mode off and when off, refetch favorites
      // TODO - implement LOOP for all favorites not just 1 of them
      userfavSection += '</td><td><a class="tooltip expand" data-title="remove map from favorites" onclick="deleteFav(json.favourites[0].id)"><i class="fa-solid fa-heart-circle-xmark"></i></a></td></tr>'
      userfavSection += `</table>`;
      $('#user-favorites-title').text('Favorites (' + json.favourites.length + '):');
      $('#user-favorites').html(userfavSection);
    }
  });
};
function getFavoritesAPI(params) {
  let url = "/api/widgets/favourites";
  if (params) {
    url += "?userId=" + params;
  }
  return $.ajax({
    url,
  });
}


const fetchAdmin = function() {
  // deal with the maps list section
  getallMapsAPI(currentUID)
  .then(function(json) {
    console.log("ALL MAPS for user:",json)
    let usermapscount = json.maps.length;
    console.log("ALL MAP COUNT:",usermapscount)
    if (usermapscount > 0) {
      let usermaplist = `<table border="0" width="100%">`;
      // TODO sort this output list by alpha
      for(let x = 0; x < usermapscount; x ++) {
        usermaplist += '<tr ><td width=100% style="padding-bottom:20px;">';
        usermaplist += json.maps[x].name;
        usermaplist += '<BR>' + json.maps[x].description;
        usermaplist += '</td><td style="padding-left:10px;" valign="top"><a href="" class="tooltip expand" data-title="edit this map"><i class="fa-solid fa-pen-to-square"></i></a></td><td style="padding-left:10px;" valign="top"><a href="" class="tooltip expand" data-title="delete this map"><i class="fa-solid fa-trash"></i></a></td></tr>';
      }
      usermaplist += '</table>';
      $('#user-mapslist-title').text('Your Maps (' + usermapscount + '):');
      $('#user-mapslist').html(usermaplist);
    }
  });
  // deal with the points list section
  getallPointsbyUserIDAPI(currentUID)
  .then(function(json) {
    console.log("ALL POINTS for user:",json)
    let usermapscount = json.points.length;
    console.log("ALL POINTS COUNT:",usermapscount)
    if (usermapscount > 0) {
      let usermaplist = `<table border="0" width="100%">`;
      // TODO sort this output list by alpha
      let mapTitle = '';
      for(let x = 0; x < usermapscount; x ++) {
        if(json.points[x].map_name !== mapTitle) {
          mapTitle = json.points[x].map_name;
          usermaplist += `<tr><td width=100% colspan=3 style="border-bottom: 1px solid black;"><i class="fa-solid fa-map fa-xl"></i>&nbsp;&nbsp;<B>${mapTitle}</B></td></tr>`;
        }
        usermaplist += `<tr ><td width=100% style="padding-bottom:20px;"><i class="fa-solid fa-map-pin"></i>&nbsp;`;
        usermaplist += json.points[x].title;
        usermaplist += '<BR>' + json.points[x].description;
        usermaplist += `</td><td style="padding-left:10px;" valign="top"><a onClick="editPin(${json.points[x].id});" class="tooltip expand" data-title="edit this point"><i class="fa-solid fa-pen-to-square"></i></a></td><td style="padding-left:10px;" valign="top"><a class="tooltip expand" data-title="delete this point" onClick="deletePin(${json.points[x].id})"><i class="fa-solid fa-trash"></i></a></td></tr>`;
      }
      usermaplist += '</table>';
      $('#user-pointslist-title').text('Your Points (' + usermapscount + '):');
      $('#user-pointslist').html(usermaplist);
    }
  });
};
function getallMapsAPI(params) {
  let url = "/api/widgets/maps";
  if (params) {
    url += "?userId=" + params;
  }
  return $.ajax({
    url,
  });
}
function getallPointsbyUserIDAPI(params) {
  let url = "/api/widgets/points";
  if (params) {
    url += "?contributorId=" + params;
  }
  return $.ajax({
    url,
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
        //console.log(key.title)
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
    /*
    for(element in json.maps) {
      mapNames.push(json.maps[element].name);
      //console.log(json.maps[element].name)
    }
    */
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


const submitNewPin = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/widgets/points",
    data,
  });
}


const deletePin = function(pinID) {
  // TODO CONFIRMATION modal
  deletePinAPI(pinID)
  .then(function(json) {
    console.log(json)
  });
}
const deletePinAPI = function(data) {
  let url = "/api/widgets/points";
  if (data) {
    url += "?pointId=" + data;
  }
  return $.ajax({
    method: "DELETE",
    url: url,
  });
}

const deleteFav = function(mapid) {
  // TODO CONFIRMATION modal
  deleteFavAPI(mapid)
  .then(function(json) {
    console.log(json)
  });
}
const deleteFavAPI = function(data) {
  let url = "/api/widgets/favourites";
  if (data) {
    url += "?id=" + data;
  }
  return $.ajax({
    method: "DELETE",
    url: url,
  });
}

const setFav = function(mapid) {
  setFavAPI(mapid)
  .then(function(json) {
    console.log(json)
  });
}
const setFavAPI = function(data) {
  let url = "/api/widgets/favourites";
  if (data) {
    url += "?mapId=" + data;
    //url += "&userId=" + currentUID;
  }
  console.log("SETFAVURL:",url)
  return $.ajax({
    method: "POST",
    url: url,
  });
}



// TODO - waiting on backend code for this
const deleteMap = function(pinID) {
  // TODO CONFIRMATION modal
  deleteMapAPI(pinID)
  .then(function(json) {
    console.log(json)
  });
}
const deleteMapAPI = function(data) {
  let url = "/api/widgets/points";
  if (data) {
    url += "?pointId=" + data;
  }
  return $.ajax({
    method: "DELETE",
    url: url,
  });
}


const submitNewMap = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/widgets/maps",
    data,
  });
};

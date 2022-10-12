function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/users/logout",
  })
}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
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

// extrastretch items
function getAllTheCities() {
  let url = "/api/allcities";
  return $.ajax({
    url,
  });
}
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
function getAverageCostPerNight() {
  let url = "/api/getaveragecostpernight";
  return $.ajax({
    url,
  });
}
function getCostPerRange() {
  let url = "/api/getcostperrange";
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

function getAllReservations() {
  let url = "/api/reservations";
  return $.ajax({
    url,
  });
}

const submitProperty = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/properties",
    data,
  });
};

//
//  app-modals.js
//  modal window handler, supporting code and various app specific modal windows (& content)
//


// create generic error modal, but with custom message
const modalError = function(message) {
  let messageOutput = `<center>
  <i class="fa-regular fa-circle-xmark" style="color:#d1342fff; font-size:6rem;"></i><br clear=all><BR>
  ${message}<br clear=all><BR>
  <a class="button accept" onClick="toggleModal();">Continue</a>
  </center>`;
  toggleModal(null,messageOutput,'modalblur');
};

// create generic success modal, but with custom message
const modalSuccess = function(message) {
  let messageOutput = `<center>
  <i class="fa-regular fa-circle-check" style="color:#d1342fff; font-size:6rem;"></i><br clear=all><BR>
  ${message}<br clear=all><BR>
  <a class="button accept" onClick="toggleModal();">Continue</a>
  </center>`;
  toggleModal(null,messageOutput);
};

// create confirmation modal - get yes/no type input for buttons
const modalConfirmation = function (message,yesButtonText,noButtonText) {
  // todo toggle g-variable state to show user has confirmed
  gConfirmation = 0; // reset state to default "no"
  let messageOutput = `<center>
  <i class="fa-regular fa-circle-xmark" style="color:#d1342fff; font-size:6rem;"></i><br clear=all><BR>
  <h3>Are you sure?</h3>
  ${message}<br clear=all><BR>
  <a class="button accept" onClick="toggleModal();gConfirmation=0;">${noButtonText}</a>&nbsp;<a class="button accept" onClick="toggleModal();gConfirmation=1;">${yesButtonText}</a>
  </center>`;
  toggleModal(null,messageOutput);
  console.log("gCONFIRMATION:",gConfirmation)
};

const delPinConfirmation = function (pid,message,yesButtonText,noButtonText) {
  let messageOutput = `<center>
  <i class="fa-regular fa-circle-xmark" style="color:#d1342fff; font-size:6rem;"></i><br clear=all><BR>
  <h3>Are you sure?</h3>
  ${message}<br clear=all><BR>
  <a class="button accept" onClick="toggleModal();">${noButtonText}</a>&nbsp;<a class="button accept" onClick="toggleModal();deletePinNext(${pid});">${yesButtonText}</a>
  </center>`;
  toggleModal(null,messageOutput);
};

//
// show Privacy Policy modal window
//
const showPrivacyPolicy = () => {
  let privacyPolicy = `
  This privacy policy is to inform you on how the information collected on this website is used. Be sure to read this privacy policy before using our website or submitting any personal information and be aware that by using our website, you are accepting the practices described in this policy. We reserve the right to make changes to this website's policy at any time without prior notice. Be also aware that privacy practices set forth in this here are for this website only and do not apply for any other linking websites.<BR><BR>
  ....etc, etc, etc.
  `;
  toggleModal('<i class="fa-solid fa-lock fa-xl icongap"></i> Privacy Policy',privacyPolicy,"modalblur", {"background":"rgb(156,115,58)","background":"linear-gradient(22deg, rgba(156,115,58,1) 0%, rgba(231,209,189,1) 100%, rgba(0,212,255,1) 100%)"});
};


//
//  newPin(lat,lng) - get info to save a new pin to this map (pin is via map click)
//
const newPin = function(lat,lng) {
  // TODO - if not logged in, advise user they need to login or sign up (and show links to do either)
  // if (currentUID === 0) {
  //   let content = `You need to be a registered user (or signed in) to add pins to maps to existing maps.
  //   <BR><BR>
  //   Sign up<BR>
  //   Sign in
  //   `;
  //   toggleModal('<i class="fa-solid fa-location-pin fa-xl"></i> Not Logged In',content);
  //   return;
  // }

  // TODO - need input form for new map point
  let content = `<div class="subtitle"><b>For your pin at ${lat.toFixed(4)}, ${lng.toFixed(4)}</b></div>
  <form action="/api/newpin" method="post" id="newpinform" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <div for="new-property-form__title" class="signup-label">Title</div>
    </div>
    <div class="new-property-form__field-wrapper warning">
    <input type="text" name="title" id="new-property-form__title">
    <small style="margin-left:5px; color:#d1342fff"></small>
  </div>

  <div class="new-property-form__field-wrapper">
    <div for="new-property-form__description" class="signup-label">Description</div>
    </div>
    <div class="new-property-form__field-wrapper">
    <textarea name="description" id="property-form__description" cols="30" rows="5"></textarea>
  </div>

  <div class="new-property-form__field-wrapper">
    <div for="new-property-form__image" class="signup-label">Image URL</div>
    </div>
    <div class="new-property-form__field-wrapper">
    <input type="text" name="imageUrl" id="new-property-form__imageurl">
  </div>
  <br>
  <div class="login-form__field-wrapper buttongap">
    <button class="button">Add Location</button>&nbsp;
    <a id="login-form__cancel" class="button" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-location-dot fa-xl icongap"></i> New Pin',content,null,{"background":"white"});
  $('#newpinform').on('submit', function (event) {
    event.preventDefault();

    // run validations
    const titleEl = document.querySelector('#new-property-form__title');
    let isTitleValid = formCheckIfEmpty(titleEl,"Map point title can't be left empty!");
    if (!isTitleValid) {
      return;
    }

    let data = $(this).serialize();

    data += `&contributorId=${currentUID}&latitude=${lat}&longitude=${lng}&mapId=${currentMap}`;

    // TODO - add map ID and submitter ID to the data
    console.log("NEW PIN: ",data)
    submitNewPin(data)
    .then(() => {
      toggleModal(); // turn off existing modal
      let modalText = `<center>
      <i class="fashadow fa-solid fa-location-dot" style="font-size:6rem; color:orange;"></i><br clear=all><BR>
      Your point has been added!<br clear=all><BR>
      <a class="button accept" onClick="toggleModal();">Continue</a>
      </center>
      `;
      toggleModal(``,modalText);
      getPointsByMap(currentMap,false);
      fetchAdmin();
      // push the details into our object mapsPointsObject
      // call placeMarker to drop pin
    })
    .catch((error) => {
      // TODO - need to JSON stringify the error object for readability
      toggleModal();
      toggleModal(`Woah!`,`There was an error saving your map pin to this map.<BR>${JSON.stringify(error)}`);
      console.error(error);
      // refresh to default map
    });
  });
};


//
//  editPin(existingPinObject) - get info to save a new pin to this map (pin is via map click)
//
const editPinModal = function(existingPinObject) {
  // TODO - need input form for new map point
  console.log("EDITPINobject:",existingPinObject);
  let content = `<div class="subtitle"><b>For your pin at ${Number(existingPinObject.latitude).toFixed(4)}, ${Number(existingPinObject.longitude).toFixed(4)}</b></div>
  <form action="/api/newpin" method="post" id="newpinform" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Title</div>
    </div>
    <div class="new-property-form__field-wrapper warning">
    <input type="text" name="title" placeholder="Title" id="new-property-form__title" value="${existingPinObject.title}">
  </div>

  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Description</div>
    </div>
    <div class="new-property-form__field-wrapper">
    <textarea placeholder="Description" name="description" id="property-form__description" cols="30" rows="5">${existingPinObject.description}</textarea>
  </div>

  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Image URL</div>
    </div>
    <div class="new-property-form__field-wrapper">
    <input type="text" name="imageUrl" placeholder="image url" id="new-property-form__imageurl" value="${existingPinObject.image_url}">
  </div>
  <br>
  <div class="login-form__field-wrapper buttongap">
    <button class="button">Update Point</button>&nbsp;
    <a id="login-form__cancel" class="button" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-location-dot fa-xl icongap"></i> Edit Existing Pin',content,null,{"background":"white"});
  $('#newpinform').on('submit', function (event) {
    event.preventDefault();
    let data = $(this).serialize();

    data += `&contributorId=${currentUID}&latitude=${Number(existingPinObject.latitude)}&longitude=${Number(existingPinObject.longitude)}&mapId=${existingPinObject.map_id}&pointId=${existingPinObject.id}`;

    // TODO - add map ID and submitter ID to the data
    console.log("UPDATE PIN URL: ",data)
    updatePin(data)
    .then(() => {
      toggleModal();
      toggleModal(``,`<center>
      <i class="fashadow fa-solid fa-location-dot" style="font-size:6rem; color:orange;"></i><br clear=all><BR>
      Your point has been updated!<br clear=all><BR>
      <a class="button accept" onClick="toggleModal();">Continue</a>
      </center>`);
      getPointsByMap(currentMap,false);
      fetchAdmin();
      // push the details into our object mapsPointsObject
      // call placeMarker to drop pin
    })
    .catch((error) => {
      // TODO - need to JSON stringify the error object for readability
      toggleModal();
      toggleModal(`Woah!`,`There was an error updating your map pin details.<BR>${JSON.stringify(error)}`);
      console.error(error);
      // refresh to default map
    });
  });
};


//
//  newPin(lat,lng) - get info to save a new pin to this map (pin is via map click)
//
const newMapModal = function() {
  if (currentUID === 0) {
    let content = `<div class="subtitle"><b>You need to be a registered user (or signed in) to create a new map.</b>
    </div>
    <br>
    <div class="login-form__field-wrapper buttongap">
    <a class="accept button" onClick="toggleModal(); showSignUp();">Sign Up</a>
    <br clear=all>&nbsp;
    </center>
    <a class="accept button" onClick="toggleModal(); showLogin();">Login</a>
    <br clear=all>&nbsp;
    </center>
    </div>
    `;
    toggleModal('<i class="fa-regular fa-circle-xmark fa-xl icongap" style="color:#d1342fff;"></i> Not Logged In',content,null,{"background":"white"});
    return;
  }
  let content = `<div class="subtitle"><b>Create a new map</b></div>
  <form action="/api/newpin" method="post" id="new-map-form" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Map Name</div>
    </div>
  <div class="new-property-form__field-wrapper warning">
    <input type="text" name="name" id="new-property-form__title">
    <small style="margin-left:5px; color:#d1342fff"></small>
  </div>


  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Description</div>
    </div>
  <div class="new-property-form__field-wrapper">
    <textarea name="description" id="property-form__description" cols="30" rows="5"></textarea>
  </div>

  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Pin Icon (SVG)</div>
    </div>
  <div class="new-property-form__field-wrapper">
    <input type="text" name="mapPins" id="new-property-form__mappin">
  </div>

  <div class="new-property-form__field-wrapper">
    <div id="privateToggleContainer">
    <input id="setPrivateToggle" class="private-toggle" type="checkbox" name="isPrivate">
    <label for="setPrivateToggle"></label>
    <label for="setPrivateToggle">Private Map?</label>Private Map?
    </div>
  </div>

  <br>
  <div class="login-form__field-wrapper buttongap">
    <button class="button">Add Map</button>&nbsp;
    <a id="login-form__cancel" class="button" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-map fa-xl icongap"></i> New Map',content,null,{"background":"white"});
  $('#new-map-form').on('submit', function (event) {
    event.preventDefault();

    // run validations
    const titleEl = document.querySelector('#new-property-form__title');
    let isTitleValid = formCheckIfEmpty(titleEl,"Map title can not be empty!");
    if (!isTitleValid) {
      return;
    }

    let data = $(this).serialize();
    data += '&category=general&ownerId=';
    data += currentUID;
    console.log("SUBMIT FOR MAP:",data)
    toggleModal();
    newMapTitle = titleEl.value.trim();
    submitNewMap(data)
      .then(() => {
        let modalText = `<center>
        <i class="fashadow fa-solid fa-map" style="font-size:6rem; color:orange"></i><br clear=all><BR>
        Your new map<BR><b>${newMapTitle}</b><BR>has been added!<br clear=all><BR>
        <a class="button accept" onClick="toggleModal();">Continue</a>
        </center>
      `;
        toggleModal(``,modalText);
        // refresh maps list and set to this new map
        fetchAdmin();
        getListofMaps(newMapTitle); // force a map to go to
      })
      .catch((error) => {
        // TODO - need to JSON stringify the error object for readability
        toggleModal(`Woah!`,`There was an error saving your listing in our database.<BR>${JSON.stringify(error)}`);
        console.error(error);
        // refresh to default map
      });
  });
};
const updateMapModal = function(existingMapid) {
  // need to fetch the map details from list
  let theMapObject = findMapObject(existingMapid);
  console.log("EDIT MAP OBJECT:",findMapObject(existingMapid));
  let checkornot = '';
  if(theMapObject.is_private) {
    checkornot = 'checked';
  }
  let content = `<div class="subtitle"><b>Update a map</b></div>
  <form action="/api/newpin" method="post" id="new-map-form" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Map Name</div>
    </div>
  <div class="new-property-form__field-wrapper warning">
    <input type="text" name="name" id="new-property-form__title" value="${theMapObject.name}">
    <small style="margin-left:5px; color:#d1342fff"></small>
  </div>


  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Description</div>
    </div>
  <div class="new-property-form__field-wrapper">
    <textarea name="description" id="property-form__description" cols="30" rows="5">${theMapObject.description}</textarea>
  </div>

  <div class="new-property-form__field-wrapper">
    <div class="signup-label">Pin Icon (SVG)</div>
    </div>
  <div class="new-property-form__field-wrapper">
    <input type="text" name="mapPins" id="new-property-form__mappin" value="${theMapObject.map_pins}">
  </div>

  <div class="new-property-form__field-wrapper">
  <div id="privateToggleContainer">
  <input id="setPrivateToggle" class="private-toggle" type="checkbox" name="isPrivate" ${checkornot}>
  <label for="setPrivateToggle"></label>
  <label for="setPrivateToggle">Private Map?</label>Private Map?
  </div>
  </div>

  <br>
  <div class="login-form__field-wrapper buttongap">
    <button class="button">Update Map</button>&nbsp;
    <a id="login-form__cancel" class="button" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-map fa-xl icongap"></i> Edit a Map',content,null,{"background":"white"});
  $('#new-map-form').on('submit', function (event) {
    event.preventDefault();

    // run validations
    const titleEl = document.querySelector('#new-property-form__title');
    let isTitleValid = formCheckIfEmpty(titleEl,"Map title can not be empty!");
    if (!isTitleValid) {
      return;
    }

    let data = $(this).serialize();
    data += `&category=general&mapId=${existingMapid}&ownerId=`;
    data += currentUID;
    console.log("SUBMIT FOR EDIT MAP:",data)
    toggleModal();

    submitEditMap(data)
      .then(() => {
        let modalText = `<center>
        <i class="fashadow fa-solid fa-map" style="font-size:6rem; color:orange"></i><br clear=all><BR>
        Your map has been updated!<br clear=all><BR>
        <a class="button accept" onClick="toggleModal();">Continue</a>
        </center>
      `;
        toggleModal(``,modalText);
        // refresh maps list and set to this new map
        fetchAdmin();
        getListofMaps();
      })
      .catch((error) => {
        //toggleModal(`Woah!`,`There was an error updating your map in our database.<BR>${JSON.stringify(error)}`);
        modalError("<h3>Critical Error!</h3>"+JSON.stringify(error));
        console.error(error);
        // refresh to default map
      });
  });
};

const showLogin = () => {
  let data = `<div class="subtitle-left"><b>Login to your Map My Wiki account to access and customize your maps</b></div>
  <form id="login-form" class="login-form">
      <div class="login-form__field-wrapper">
        <div class="signup-label">Email</div>
      </div>
      <div class="login-form__field-wrapper">
        <input type="email" name="email">
      </div>

      <div class="login-form__field-wrapper">
        <div class="signup-label">Password</div>
      </div>
      <div class="login-form__field-wrapper">
          <input type="password" name="password" >
        </div>
      <br>
      <div class="login-form__field-wrapper buttongap">
          <button class="button">Login</button>&nbsp;
          <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
      </div>
    </form>
    `;
    toggleModal('<i class="fa-solid fa-user fa-xl icongap" ></i> Login',data,null,{"background":"white"});
    $('#login-form').on('submit', function (event) {
      event.preventDefault();
      let data = $(this).serialize();
      console.log(data)
      toggleModal();
      logIn(data)
      .then(json => {
        console.log(json);
        if (!json.user) {
          toggleModal('',`<center>
          <i class="fa-regular fa-circle-xmark" style="color:#d1342fff; font-size:4rem;"></i><br clear=all><BR>
          Failed to login.<BR>Please check your user name and password.<br clear=all><BR>
          <a class="button accept" onClick="toggleModal(); showLogin();">Try Again</a>
          </center>`);
          return;
        }
        console.log(json.user);
        currentUID = json.user.id;
        updateNav(json.user);
        // show admin section
        $('#favoritestatus').css('visibility','visible');
        fetchFavorites();
        fetchAdmin();
        $('#adminsection').slideDown('slow');
      });
    });
}

const showAdminSection =() => {
  $('#adminsection').hide();
  $('#useronlysection').slideDown('slow');
};

const hideAdminSection =() => {
  let intervalTime = 425;
  if($('.mini-block').hasClass('active')) {
    $('#adminsection').delay(intervalTime * 5).slideDown('slow');
    $('#useronlysection').delay(intervalTime * 4).slideUp('slow');
    $('.mini-able').slideUp('slow');
    $('.mini-block').removeClass('active');
    $('.toggle-able').delay(intervalTime * 2).slideUp('slow');
    $('.toggle-block').removeClass('active');
    return;
  } else if ($('.toggle-block').hasClass('active')) {
    $('#adminsection').delay(intervalTime * 3).slideDown('slow');
    $('#useronlysection').delay(intervalTime * 2).slideUp('slow');
    $('.toggle-able').slideUp('slow');
    $('.toggle-block').removeClass('active');
    return;
  } else {
    $('#adminsection').delay(intervalTime).slideDown('slow');
    $('#useronlysection').slideUp('slow');
    return;
  }
};


const showSignUp = () => {
  let data = `<div class="subtitle-left"><b>Create an account for Map My Wiki to access and customize your maps</b></div>
  <form id="login-form" class="login-form">
      <div class="login-form__field-wrapper">
        <div class="signup-label">Email</div>
      </div>
      <div class="login-form__field-wrapper">
        <input type="email" name="email">
      </div>

      <div class="login-form__field-wrapper">
        <div class="signup-label">Password</div>
      </div>
      <div class="login-form__field-wrapper">
          <input type="password" name="password" >
        </div>
      <br>
      <div class="login-form__field-wrapper buttongap">
          <button class="button">Register</button>&nbsp;
          <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
      </div>
    </form>
    `;
    toggleModal('<i class="fa-solid fa-user-plus fa-xl icongap"></i> Sign Up',data,null,{"background":"white"});
}


//
// show "about" modal window
//
const showAbout = () => {
  let privacyPolicy = `<center>
  <i class="fashadow fa-solid fa-circle-question" style="font-size:6rem;color:orange"></i><br clear=all>
  <h3 style="font-size:1.3rem">About Map My Wiki</h3>
  <div style="font-size:1.1rem">Map My Wiki is a mid-term project for <a href="http://www.lighthouselabs.ca" title="https://www.lighthouselabs.ca" target=_new>LightHouse Labs</a>.</div><BR>
  <div style="font-size:1.1rem">Produced by Full-Stack Developers:<br>
  <div style="text-align:left; padding-left:5.8rem;"><span class="modal-info"><a href="http://www.github.com/ej8899" title="https://www.github.com/ej8899" target=_new><i class="fa-brands fa-github abouticoncolor"></a></i> Ernie Johnson (Frontend)&nbsp;<i class="fa-brands fa-sass abouticoncolor" ></i> <i class="fa-brands fa-square-js abouticoncolor"></i>&nbsp;<i class="fa-brands fa-html5 abouticoncolor"></i>&nbsp;  <i class="fa-brands fa-css3-alt abouticoncolor"></i></span><BR>
  <span class="modal-info"><a href="http://www.github.com/atyoshimatsu" title="https://www.github.com/atyoshimatsu" target=_new><i class="fa-brands fa-github abouticoncolor"></a></i> Atsuyuki Yoshimatsu (Backend)&nbsp; <i class="fa-brands fa-node-js abouticoncolor"></i>&nbsp; <i class="fa-solid fa-database abouticoncolor" ></i></span></div></div>
  <div class="modal-info"><BR>
  <p>&copy; Copyright 2022, All Rights Reserved | <a href="https://github.com/ej8899/lhl-midterm" title="https://github.com/ej8899/lhl-midterm">Get the latest version on <i class="fa-brands fa-github"></i></a></p>
  </div>
  <center><br clear=all><a class="button accept" onClick="toggleModal();">Close</a></center>
  `;

  toggleModal('', privacyPolicy, null, {"background":"rgb(156,115,58)","background":"linear-gradient(22deg, rgba(156,115,58,1) 0%, rgba(231,209,189,1) 100%, rgba(0,212,255,1) 100%)"});
};


//
// show "contact us" modal window
//
const showContact = () => {
  let privacyPolicy = `<center>
  <i class="fashadow fa-solid fa-address-card" style="font-size:6rem;color:orange"></i><br clear=all>
  <h3>Contact the Developers:</h3>
  <div class="modal-contact">
  <table border=0 style="font-size:1.1rem;">
  <tr><td>
  <li>Ernie Johnson</li></td><td><a href="https://www.linkedin.com/in/ernie-johnson-3b77829b/"  class="tooltip expand" data-title="check us out on linkedin" target=_new><i class="fa-brands fa-linkedin fa-lg"></i></a> <a href="http://www.github.com/ej8899" title="https://www.github.com/ej8899" target=_new><i class="fa-brands fa-github"></i></a></td></tr>
  <tr><td><li>Atsuyuki Yoshimatsu</li></td><td><a href="https://www.linkedin.com/in/atsuyuki/" class="tooltip expand" data-title="check us out on linkedin" target=_new><i class="fa-brands fa-linkedin fa-lg"></i></a> <a href="http://www.github.com/atyoshimatsu" title="https://www.github.com/atyoshimatsu" target=_new><i class="fa-brands fa-github"></i></a></td></tr></table>
  </div>
  <br clear=all><a class="button accept" onClick="toggleModal();">Close</a>
  <br clear=all>&nbsp;
  </center>
  `;

  toggleModal('',privacyPolicy, null, {"background":"rgb(156,115,58)","background":"linear-gradient(22deg, rgba(156,115,58,1) 0%, rgba(231,209,189,1) 100%, rgba(0,212,255,1) 100%)"});
};

//
// show "request location access" modal window
//
const reqLocationModal = () => {
  let reqLocation = `
  <center>
  <div class="home" style="font-size:34pt;">Map My Wiki</div>
  <i class="fashadow fa-solid fa-map-location-dot" style="font-size:6rem;"></i><br clear=all><BR>
  This app uses your geographic location to work correctly and to enhance the user experience with our maps.
  <div class="modal-info">
  <br>The information is not used to identify or contact the user.<BR><BR>
  </div>
  <div class="modal-info">
  <span>&copy; Copyright 2022, All Rights Reserved | <a href="https://github.com/ej8899/lhl-midterm" title="https://github.com/ej8899/lhl-midterm"> Get the latest version on <i class="fa-brands fa-github"></i></a></span><BR><BR>
  </div>


  <a class="button accept" onClick="toggleModal();tisTheSeason();">Continue</a>
  <br clear=all>&nbsp;
  </center>
  `;

  toggleModal('', reqLocation, 'modalblur',{"background":"rgb(156,115,58)","background":"linear-gradient(22deg, rgba(156,115,58,1) 0%, rgba(231,209,189,1) 100%, rgba(0,212,255,1) 100%)"});
  //toggleModal('', reqLocation, 'modalblur',{"background-color":"red"});
};

//
// toggleModal(title,body)
// modal library at http://www.github.com/ej8899/conColors
//
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
$("#propertySubmit").removeAttr("style"); // helps eliminate any initial page draw showing the modal window
const toggleModal = function(title,body,effect,extracss) {
  if(extracss) {
    $("#modal-content").css(extracss);
    // todo - we need to remove and reset the modal css  when we close it.
    // https://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element
  }
  $("#modal-title").html(title);
  $("#modal-body").html(body);
  modal.classList.toggle("show-modal");

  if(!effect) {
    effect = 'modaldim';
  };

  if (modal.classList.contains("show-modal")) {
    // add listener (for escape close of modal)
    document.addEventListener('keyup',modalKeys);
    $("#propertySubmit").addClass(effect);

  } else {
    document.removeEventListener('keyup',modalKeys);
    $("#propertySubmit").removeClass("modalblur");
    $("#propertySubmit").removeClass("modaldim");
  }
};
const modalKeys = function(theKey) {
  if (theKey.key === "Escape") {
    toggleModal();
  }
};
// modal needs window click handler to clear it
const windowOnClick = function(event) {
  if (event.target === modal) {
    toggleModal();
  }
};
// modal listeners for general window click and close button
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);


//
// form validation functions:
//
// TODO fully implement this concept for future use
// https://www.javascripttutorial.net/javascript-dom/javascript-form-validation/#:~:text=What%20is%20form%20validation,is%20called%20client%2Dside%20validation.
const isRequired = value => value === '' ? false : true;

const showFormError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove('formsuccess');
  formField.classList.add('formerror');
  const error = formField.querySelector('small');
  error.textContent = message;
};

const showFormSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove('formerror');
  formField.classList.add('formsuccess');
  const error = formField.querySelector('small');
  error.textContent = '';
};

const formCheckIfEmpty = (elementId,errorMessage) => {
  let valid = false;
  const username = elementId.value.trim();

  if (!isRequired(username)) {
    showFormError(elementId, errorMessage);
  } else {
    showFormSuccess(elementId);
    valid = true;
  }
  return valid;
}

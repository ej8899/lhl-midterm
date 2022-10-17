//
// show Privacy Policy modal window
//
const showPrivacyPolicy = () => {
  let privacyPolicy = `
  This privacy policy is to inform you on how the information collected on this website is used. Be sure to read this privacy policy before using our website or submitting any personal information and be aware that by using our website, you are accepting the practices described in this policy. We reserve the right to make changes to this website's policy at any time without prior notice. Be also aware that privacy practices set forth in this here are for this website only and do not apply for any other linking websites.<BR><BR>
  ....etc, etc, etc.
  `;
  toggleModal('<i class="fa-solid fa-lock fa-xl"></i> Privacy Policy',privacyPolicy,"modalblur");
};

//
//  newPin(lat,lng) - get info to save a new pin to this map (pin is via map click)
//
const newPin = function(lat,lng) {
  // TODO - if not logged in, advise user they need to login or sign up (and show links to do either)
  if (currentUID === 0) {
    let content = `You need to be a registered user (or signed in) to add pins to maps to existing maps.
    <BR><BR>
    Sign up<BR>
    Sign in
    `;
    toggleModal('<i class="fa-solid fa-location-pin fa-xl"></i> Not Logged In',content);
    return;
  }

  // TODO - need input form for new map point
  let content = `For your pin at<BR>${lat},<BR>${lng}
  <form action="/api/newpin" method="post" id="newpinform" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <label for="new-property-form__title">Title</label>
    <input type="text" name="title" placeholder="Title" id="new-property-form__title">
  </div>

  <div class="new-property-form__field-wrapper">
    <label for="new-property-form__description">Description</label>
    <textarea placeholder="Description" name="description" id="property-form__description" cols="30" rows="10"></textarea>
  </div>

  <div class="new-property-form__field-wrapper">
    <label for="new-property-form__image">Image URL</label>
    <input type="text" name="image_url" placeholder="image url" id="new-property-form__imageurl">
  </div>

  <div class="login-form__field-wrapper">
    <button class="button">Add Location</button>&nbsp;
    <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-location-pin fa-xl"></i> New Pin',content);
  $('#newpinform').on('submit', function (event) {
    event.preventDefault();
    let data = $(this).serialize();

    data += `&contributor_id=${currentUID}&latitude=${lat}&longitude=${lng}&map_id=${currentMap}`;

    // TODO - add map ID and submitter ID to the data
    console.log("NEW PIN: ",data)
    submitNewPin(data)
    .then(() => {
      toggleModal(`Got It!`,`Your pin is now ready to go!`);
      getPointsByMap(currentMap);
      // push the details into our object mapsPointsObject
      // call placeMarker to drop pin
    })
    .catch((error) => {
      // TODO - need to JSON stringify the error object for readability
      toggleModal(`Woah!`,`There was an error saving your map pin to this map.<BR>${error}`);
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
    let content = `You need to be a registered user (or signed in) to create a new map.
    <BR><BR>
    Sign up<BR>
    Sign in
    `;
    toggleModal('<i class="fa-solid fa-location-pin fa-xl"></i> Not Logged In',content);
    return;
  }
  let content = `Create a new map
  <form action="/api/newpin" method="post" id="new-map-form" class="new-property-form">
  <div class="new-property-form__field-wrapper">
    <label for="new-property-form__title">Map Name</label>
    <input type="text" name="name" placeholder="Map Title" id="new-property-form__title">
  </div>

  <div class="new-property-form__field-wrapper">
    <label for="new-property-form__description">Description</label>
    <textarea placeholder="Description" name="description" id="property-form__description" cols="30" rows="10"></textarea>
  </div>

  <div class="login-form__field-wrapper">
    <button class="button">Add Map</button>&nbsp;
    <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
  </div>
  </form>
  `;
  toggleModal('<i class="fa-solid fa-map fa-xl"></i> New Map',content);
  $('#new-map-form').on('submit', function (event) {
    event.preventDefault();
    let data = $(this).serialize();
    data += '&category=general&is_private=false&owner_id=';
    data += currentUID;
    console.log("SUBMIT FOR MAP:",data)
    toggleModal();

    submitNewMap(data)
      .then(() => {
        toggleModal(`Got It!`,`Your map is now ready to go!`);
        // refresh maps list and set to this new map
        getListofMaps();
      })
      .catch((error) => {
        // TODO - need to JSON stringify the error object for readability
        toggleModal(`Woah!`,`There was an error saving your listing in our database.<BR>${error}`);
        console.error(error);
        // refresh to default map
      });
  });
};


const showLogin = () => {
  let data = `
  <form id="login-form" class="login-form">
      <div class="login-form__field-wrapper">
        <input type="email" name="email" placeholder="Email">
      </div>

      <div class="login-form__field-wrapper">
          <input type="password" name="password" placeholder="Password">
        </div>

      <div class="login-form__field-wrapper">
          <button class="button">Login</button>&nbsp;
          <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
      </div>
    </form>
    `;
    toggleModal('<i class="fa-solid fa-address-card fa-xl"></i> Log In',data);
    $('#login-form').on('submit', function (event) {
      event.preventDefault();
      let data = $(this).serialize();
      console.log(data)
      toggleModal();
      logIn(data)
      .then(json => {
        console.log(json);
        if (!json.user) {
          toggleModal('','failed to log in');
          return;
        }
        console.log(json.user);
        currentUID = json.user.id;
        updateNav(json.user);
        //views_manager.show('listings');
      });
    });
}

const showSignUp = () => {
  let data = `SIGN UP FORM - give info WHY (custom maps)
  <form id="login-form" class="login-form">
      <div class="login-form__field-wrapper">
        <input type="email" name="email" placeholder="Email">
      </div>

      <div class="login-form__field-wrapper">
          <input type="password" name="password" placeholder="Password">
        </div>

      <div class="login-form__field-wrapper">
          <button class="button">Register</button>&nbsp;
          <a id="login-form__cancel" class="button" href="#" onClick="toggleModal();">Cancel</a>
      </div>
    </form>
    `;
    toggleModal('<i class="fa-solid fa-users fa-xl"></i> Sign Up',data);
}


//
// show "about" modal window
//
const showAbout = () => {
  let privacyPolicy = `
  Map My Wiki is a mid-term project for <a href="http://www.lighthouselabs.ca" title="https://www.lighthouselabs.ca" target=_new>Light House Labs</a>.<BR><BR>
  Produced by Full-Stack Developers:<br>
  <span class="modal-info"><a href="http://www.github.com/ej8899" title="https://www.github.com/ej8899" target=_new><i class="fa-brands fa-github"></a></i> Ernie Johnson (Frontend)  <i class="fa-brands fa-sass" ></i> <i class="fa-brands fa-node-js"></i> <i class="fa-brands fa-html5" ></i>  <i class="fa-brands fa-css3-alt "></i></span><BR>
  <span class="modal-info"><a href="http://www.github.com/atyoshimatsu" title="https://www.github.com/atyoshimatsu" target=_new><i class="fa-brands fa-github"></a></i> Atsuyuki Yoshimatsu (Backend) <i class="fa-brands fa-node-js"></i> <i class="fa-solid fa-database" ></i></span>
  <div class="modal-info">
  <p>&copy; Copyright 2022, All Rights Reserved<BR><a href="https://github.com/ej8899/lhl-midterm" title="https://github.com/ej8899/lhl-midterm">Get the latest version on <i class="fa-brands fa-github"></i></a></p>
  </div>
  `;

  toggleModal('<i class="fa-solid fa-circle-question fa-xl"></i> About', privacyPolicy);
};


//
// show "contact us" modal window
//
const showContact = () => {
  let privacyPolicy = `
  Reach out to the Developers:<BR>
  <div class="modal-contact">
  <li>
  Ernie Johnson <a href="https://www.linkedin.com/in/ernie-johnson-3b77829b/ target="new" class="tooltip expand" data-title="check us out on linkedin"><i class="fa-brands fa-linkedin fa-lg"></i></a> <a href="http://www.github.com/ej8899" title="https://www.github.com/ej8899" target=_new><i class="fa-brands fa-github"></i></a><br></li>
  <li>Atsuyuki Yoshimatsu <a href="https://www.linkedin.com/in/atsuyuki/ target="new" class="tooltip expand" data-title="check us out on linkedin"><i class="fa-brands fa-linkedin fa-lg"></i></a> <a href="http://www.github.com/atyoshimatsu" title="https://www.github.com/atyoshimatsu" target=_new><i class="fa-brands fa-github"></i></a></li>
  </div>
  `;

  toggleModal('<i class="fa-solid fa-address-card fa-xl"></i> Contact Us',privacyPolicy);
};

//
// show "request location access" modal window
//
const reqLocationModal = () => {
  let reqLocation = `
  <table border=0 width=100%><tr>
  <td style="padding-right:20px;"><i class="fashadow fa-solid fa-map-location-dot" style="font-size:6rem;"></i></td><td><b>Map My Wiki</b> uses your geographic location to work correctly and to enhance the user experience on our maps.</td></tr></table>
  <div class="modal-info">
  <br>The information is not used to identify or contact the user.<BR><BR>
  </div>
  <div class="modal-info">
  <span>&copy; Copyright 2022, All Rights Reserved<BR><a href="https://github.com/ej8899/lhl-midterm" title="https://github.com/ej8899/lhl-midterm"> Get the latest version on <i class="fa-brands fa-github"></i></a></span><BR><BR>
  </div>
  <div class="modal-button">
  <button class="accept" onClick="toggleModal();">Click to Continue  <i class="fa-solid fa-thumbs-up"></i></button>
  </div>
  `;

  toggleModal('', reqLocation, 'modalblur');
};

//
// toggleModal(title,body)
// modal library at http://www.github.com/ej8899/conColors
//
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
$("#propertySubmit").removeAttr("style"); // helps eliminate any initial page draw showing the modal window
const toggleModal = function(title,body,effect) {
  // modal-title, modal-body
  /*
  $("#modal-title").html(title);
  $("#modal-body").html(body);
  modal.classList.toggle("show-modal");

  if (modal.classList.contains("show-modal")) {
    // add listener (for escape close of modal)
    document.addEventListener('keyup',modalKeys);
  } else {
    document.removeEventListener('keyup',modalKeys);
  }*/
  // TODO remove above when below is tested
    // modal-title, modal-body
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

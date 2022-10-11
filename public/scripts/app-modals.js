//
// show Privacy Policy modal window
//
const showPrivacyPolicy = () => {
  let privacyPolicy = `
  This privacy policy is to inform you on how the information collected on this website is used. Be sure to read this privacy policy before using our website or submitting any personal information and be aware that by using our website, you are accepting the practices described in this policy. We reserve the right to make changes to this website's policy at any time without prior notice. Be also aware that privacy practices set forth in this here are for this website only and do not apply for any other linking websites.<BR><BR>
  ....etc, etc, etc.
  `;
  toggleModal('<i class="fa-solid fa-lock"></i> Privacy Policy',privacyPolicy);
};


//
// show "about" modal window
//
const showAbout = () => {
  let privacyPolicy = `
  The Wiki Maps project is a <a href="http://www.lighthouselabs.ca" target=_new>LightHouseLabs.ca</a> mid-term project.<BR><BR>
  Completed by<BR>
  Ernie Johnson - Frontend, including JS, HTML & CSS<BR>
  Atsuyuki Yoshimatsu - Backend, including database.
  `;
  toggleModal('<i class="fa-solid fa-circle-question"></i> About',privacyPolicy);
};


//
// show "contact us" modal window
//
const showContact = () => {
  let privacyPolicy = `
  insert contact us links here - linked in links with icons?
  `;
  toggleModal('<i class="fa-solid fa-address-card"></i> Contact Us',privacyPolicy);
};

//
// toggleModal(title,body)
// modal library at http://www.github.com/ej8899/conColors
//
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
$("#propertySubmit").removeAttr("style"); // helps eliminate any initial page draw showing the modal window
const toggleModal = function(title,body) {
  // modal-title, modal-body
  $("#modal-title").html(title);
  $("#modal-body").html(body);
  modal.classList.toggle("show-modal");

  if (modal.classList.contains("show-modal")) {
    // add listener (for escape close of modal)
    document.addEventListener('keyup',modalKeys);
  } else {
    document.removeEventListener('keyup',modalKeys);
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

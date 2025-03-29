const {togglePasswordVisibility} = require("../js/show-password")
const submitButton = document.getElementById("submitBtn");
const password = document.getElementById("account_password");
const eyeIcon = document.getElementById("eyeicon");


if(eyeIcon && password) {
    eyeIcon.addEventListener("click", () => {
        togglePasswordVisibility(password, eyeIcon);
    })
}

const firstEyeicon = document.getElementById("first-eyeicon");
const secondEyeicon = document.getElementById("second-eyeicon")
const password = document.getElementById("account_password");
const confirmPassword = document.getElementById("confirm-password")



const togglePasswordVisibility = (inputElement, eyeIcon) => {

    const isPassword = inputElement.type === "password";
    inputElement.type = isPassword ? "text" : "password";
    eyeIcon.src = isPassword ? "/images/eye-open.png" : "/images/eye-close.png";
};

if(firstEyeicon && password) {
    firstEyeicon.addEventListener("click", () => {
        togglePasswordVisibility(password, firstEyeicon);
    })
}


if(secondEyeicon && confirmPassword){
    secondEyeicon.addEventListener("click", () => {
        togglePasswordVisibility(confirmPassword, secondEyeicon);
    })
}

module.exports = {togglePasswordVisibility}

const password = document.getElementById("accountPassword");
const confirmPassword = document.getElementById("confirmPassword")
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const firstEyeIcon = document.getElementById("first-eyeIcon");
const secondEyeIcon = document.getElementById("second-eyeIcon");

const IMAGE_PATHS = {
    open: "/images/eye-open.png",
    closed: "/images/eye-close.png"
};


togglePassword.addEventListener("click", () => {

    togglePasswordVisibility(password, firstEyeIcon)
});

toggleConfirmPassword.addEventListener("click", () => {
    togglePasswordVisibility(confirmPassword, secondEyeIcon)
});


const togglePasswordVisibility = (inputElement, eyeIcon) => {
    const isPassword = inputElement.type === "password";
    inputElement.type = isPassword ? "text" : "password";
    eyeIcon.src = isPassword ? IMAGE_PATHS.open : IMAGE_PATHS.closed;
    eyeIcon.alt = isPassword ? "Hide password" : "Show password";
};


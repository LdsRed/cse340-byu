document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeicon");

    if(!passwordInput || !eyeIcon){
        console.error("Password input or eye icon element not found");
        return;
    }

    if(!eyeIcon.alt){
        eyeIcon.alt = "Toggle password visibility";
    }


    eyeIcon.setAttribute("role", "button");
    eyeIcon.setAttribute("aria-pressed", "false");
    eyeIcon.setAttribute("aria-label", "Show password");



    eyeIcon.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        eyeIcon.src = isPassword ? "/images/eye-open.png" : "/images/eye-close.png";
        eyeIcon.setAttribute("aria-pressed", isPassword ? "true" : "false");
        eyeIcon.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");

        passwordInput.focus();

    });

    eyeIcon.addEventListener("keydown", (e) =>{
        if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            eyeIcon.click();
        }
    });
});
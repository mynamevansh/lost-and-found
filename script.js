const starCount = 100;
const shootingStarCount = 5;
const body = document.body;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = Math.random() * 100 + "vh";
    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = Math.random() * 1.5 + 0.5 + "s";
    body.appendChild(star);
}

for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = document.createElement("div");
    shootingStar.classList.add("shooting-star");
    shootingStar.style.top = Math.random() * 100 + "vh";
    shootingStar.style.left = Math.random() * 100 + "vw";
    shootingStar.style.animationDelay = Math.random() * 5 + "s";
    body.appendChild(shootingStar);
}

const container = document.getElementById("container");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");

signUpButton.addEventListener("click", () => {
    container.classList.add("active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("active");
});

const loadingScreen = document.getElementById("loading-screen");
const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");

function showLoadingAndRedirect(url) {
    loadingScreen.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = url;
    }, 3000);
}

signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showLoadingAndRedirect("main.html");
});

signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showLoadingAndRedirect("main.html");
});
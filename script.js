const starCount = 100;
const shootingStarCount = 45;
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
document.getElementById("signUp").addEventListener("click", () => {
    container.classList.add("active");
});
document.getElementById("signIn").addEventListener("click", () => {
    container.classList.remove("active");
});

const loadingScreen = document.getElementById("loading-screen");



document.getElementById("signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoadingAndRedirect("main.html");
});

document.getElementById("signInForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "vansh@gmail.com" && password === "0000") {
        loadingScreen.classList.remove("hidden");
        setTimeout(() => {
            window.location.href = "main.html";
        }, 3000);
    } else {
        alert("Invalid email or password. Please try again.");
        location.reload();
    }
});
const starCount = 180;
const shootingStarCount = 500;
const body = document.body;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = Math.random() * 100 + "vh";
    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = (Math.random() * 1.5 + 0.5) + "s";
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
const signUpBtn = document.getElementById("signUp");
const signInBtn = document.getElementById("signIn");
const loadingScreen = document.getElementById("loading-screen");

signUpBtn?.addEventListener("click", () => container.classList.add("active"));
signInBtn?.addEventListener("click", () => container.classList.remove("active"));

const API_BASE = "https://lost-and-found-9cwe.onrender.com/api/users";

const signUpForm = document.getElementById("signUpForm");
signUpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(`Sign Up failed: ${result.message || "Unknown error"}`);
            return;
        }

        const userData = result.data || result;
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userId", userData._id);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role || 'user');
        window.location.replace("main.html");
    } catch (err) {
        console.error("Sign Up error:", err);
        alert("Sign Up failed. Please try again.");
    }
});

const signInForm = document.getElementById("signInForm");
signInForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(`Sign In failed: ${result.message || "Invalid credentials"}`);
            return;
        }

        const userData = result.data || result;
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userId", userData._id);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role || 'user');
        window.location.replace("main.html");
    } catch (err) {
        console.error("Sign In error:", err);
        alert("Sign In failed. Please try again.");
    }
});

document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        try {
            const range = selection.getRangeAt(0);
            console.log("Selected text:", range.toString());
        } catch (err) {
            console.warn("Error getting selection range:", err);
        }
    }
});
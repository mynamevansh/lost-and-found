// 🌟 Starry Background Setup
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

// 📝 UI Controls for Switching Forms
const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUp");
const signInBtn = document.getElementById("signIn");
const loadingScreen = document.getElementById("loading-screen");

signUpBtn?.addEventListener("click", () => container.classList.add("active"));
signInBtn?.addEventListener("click", () => container.classList.remove("active"));

// 🌐 Backend API URL
const API_BASE = "http://localhost:5000/api/users";

// ✉️ Handle Sign Up
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

        // Redirect immediately after successful registration
        localStorage.setItem("userToken", result.token);
        localStorage.setItem("userName", result.name);
        window.location.href = "main.html"; // Change to your target page
    } catch (err) {
        console.error("Sign Up error:", err);
        alert("Sign Up failed. Please try again.");
    }
});

// 🔑 Handle Sign In
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

        // Redirect immediately after successful login
        localStorage.setItem("userToken", result.token);
        localStorage.setItem("userName", result.name);
        window.location.href = "main.html"; // Change to your target page
    } catch (err) {
        console.error("Sign In error:", err);
        alert("Sign In failed. Please try again.");
    }
});

// 📚 Selection Handling Logic (merged from content.js)
document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        try {
            const range = selection.getRangeAt(0);
            console.log("Selected text:", range.toString());
            // Your selection handling logic here
        } catch (err) {
            console.warn("Error getting selection range:", err);
        }
    } else {
        //console.warn("No selection or range found.");
    }
});

// Note: Google Sign-In is now initialized in index.html
// Click handlers are attached there after GSI loads
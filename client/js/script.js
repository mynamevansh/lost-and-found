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

// 🔗 Google Sign-In Integration
document.addEventListener('DOMContentLoaded', () => {
    let gsiInitialized = false;
    let lastPromptAt = 0;
    const PROMPT_COOLDOWN_MS = 30000; // 30 seconds

    function initGSI() {
        if (!window.GOOGLE_CLIENT_ID || !window.google || gsiInitialized) return;
        
        try {
            // Initialize without auto-prompt to prevent FedCM errors
            google.accounts.id.initialize({
                client_id: window.GOOGLE_CLIENT_ID,
                callback: window.handleGoogleSignIn,
                ux_mode: 'popup',
                auto_select: false,
                cancel_on_tap_outside: false
            });
            
            // Disable auto-prompt and FedCM to prevent abort errors
            google.accounts.id.disableAutoSelect();
            
            gsiInitialized = true;
            console.log('Google Sign-In initialized successfully');
        } catch (err) {
            console.error('GSI initialization error:', err);
        }
    }

    // Initialize when GSI script loads
    setTimeout(initGSI, 100); // Small delay to ensure script is loaded
    const gsiScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (gsiScript) {
        gsiScript.addEventListener('load', () => {
            setTimeout(initGSI, 100);
        });
    }

    // Attach click handler to Google icons
    document.querySelectorAll('.social-icons .icon.google').forEach(icon => {
        icon.setAttribute('role', 'button');
        icon.setAttribute('aria-label', 'Sign in with Google');
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!gsiInitialized) {
                // Try to initialize one more time
                initGSI();
                if (!gsiInitialized) {
                    alert('Google Sign-In not ready. Please try again.');
                    return;
                }
            }

            const now = Date.now();
            if (now - lastPromptAt < PROMPT_COOLDOWN_MS) {
                console.log('GSI prompt cooldown active, please wait...');
                return;
            }

            lastPromptAt = now;
            try {
                // Use renderButton instead of prompt to avoid FedCM issues
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log('Google prompt was dismissed or not shown');
                        // Fallback: try to render a temporary button
                        const tempDiv = document.createElement('div');
                        tempDiv.style.position = 'fixed';
                        tempDiv.style.top = '50%';
                        tempDiv.style.left = '50%';
                        tempDiv.style.transform = 'translate(-50%, -50%)';
                        tempDiv.style.zIndex = '10000';
                        tempDiv.style.background = 'white';
                        tempDiv.style.padding = '20px';
                        tempDiv.style.borderRadius = '8px';
                        tempDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                        document.body.appendChild(tempDiv);
                        
                        google.accounts.id.renderButton(tempDiv, {
                            theme: 'filled_blue',
                            size: 'large',
                            text: 'signin_with',
                            shape: 'rectangular'
                        });
                        
                        // Auto-remove after 10 seconds
                        setTimeout(() => {
                            if (tempDiv.parentNode) {
                                tempDiv.parentNode.removeChild(tempDiv);
                            }
                        }, 10000);
                    }
                });
            } catch (err) {
                console.error('Error showing Google prompt:', err);
                // Fallback: try direct renderButton approach
                try {
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'fixed';
                    tempDiv.style.top = '50%';
                    tempDiv.style.left = '50%';
                    tempDiv.style.transform = 'translate(-50%, -50%)';
                    tempDiv.style.zIndex = '10000';
                    tempDiv.style.background = 'white';
                    tempDiv.style.padding = '20px';
                    tempDiv.style.borderRadius = '8px';
                    tempDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                    document.body.appendChild(tempDiv);
                    
                    google.accounts.id.renderButton(tempDiv, {
                        theme: 'filled_blue',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular'
                    });
                    
                    // Add close button
                    const closeBtn = document.createElement('button');
                    closeBtn.textContent = '×';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '5px';
                    closeBtn.style.right = '5px';
                    closeBtn.style.border = 'none';
                    closeBtn.style.background = 'transparent';
                    closeBtn.style.fontSize = '20px';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.onclick = () => {
                        if (tempDiv.parentNode) {
                            tempDiv.parentNode.removeChild(tempDiv);
                        }
                    };
                    tempDiv.appendChild(closeBtn);
                    
                    // Auto-remove after 15 seconds
                    setTimeout(() => {
                        if (tempDiv.parentNode) {
                            tempDiv.parentNode.removeChild(tempDiv);
                        }
                    }, 15000);
                } catch (renderErr) {
                    console.error('Fallback render button error:', renderErr);
                    alert('Google Sign-In temporarily unavailable. Please try email/password login.');
                }
            }
        });
    });
});
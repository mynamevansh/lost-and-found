const starCount = 100;
const shootingStarCount = 500;
const body = document.body;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = Math.random() * 100 + 'vh';
    star.style.left = Math.random() * 100 + 'vw'; 
    star.style.animationDuration = Math.random() * 1.5 + 0.5 + 's';
    body.appendChild(star);
}

for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    shootingStar.style.top = Math.random() * 100 + 'vh';
    shootingStar.style.left = Math.random() * 100 + 'vw';
    shootingStar.style.animationDelay = Math.random() * 3 + 's';
    shootingStar.style.animationDuration = Math.random() * 2 + 1 + 's';
    body.appendChild(shootingStar);
}

function navigateWithLoader(url) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('visible');
        loadingScreen.classList.remove('hidden');
        try { 
            sessionStorage.setItem('navigating', '1'); 
        } catch (e) {
            console.error('SessionStorage error:', e);
        }
    }

    // Small delay to show UI feedback then navigate
    setTimeout(() => {
        // Use assign so history is preserved
        window.location.assign(url);
    }, 250);
}

// Ensure loader is hidden once a new page finishes loading
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    try {
        const navigating = sessionStorage.getItem('navigating');
        if (navigating) {
            // Clear flag immediately so subsequent loads behave normally
            sessionStorage.removeItem('navigating');
            if (loadingScreen) {
                // Allow a tiny delay so CSS transition plays smoothly
                setTimeout(() => {
                    loadingScreen.classList.remove('visible');
                    loadingScreen.classList.add('hidden');
                }, 150);
            }
            return;
        }

        // Normal page load (not from navigation)
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.remove('visible');
                loadingScreen.classList.add('hidden');
            }, 150);
        }
    } catch (e) {
        console.error('Load handler error:', e);
        // Fallback: always hide loader on error
        if (loadingScreen) {
            loadingScreen.classList.remove('visible');
            loadingScreen.classList.add('hidden');
        }
    }
});
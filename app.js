const starCount = 100;
const shootingStarCount = 45;
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
    loadingScreen.classList.remove('hidden');

    setTimeout(() => {
        window.location.href = url;
    }, 2000);
}

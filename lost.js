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




let boxCount = document.querySelectorAll('.lost-container .box').length + 1;

document.querySelector('.lost-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const itemLost = document.getElementById('item-lost').value;
    const lastSeen = document.getElementById('last-seen').value;
    const contactInfo = document.getElementById('contact-info').value;
    const description = document.getElementById('description').value;
    const photoInput = document.getElementById('photo');
    const photoFile = photoInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const lostContainer = document.querySelector('.lost-container');
        const boxDiv = document.createElement('div');
        boxDiv.className = 'box';
        boxDiv.innerHTML = `
            <div class="box-image" style="background-image: url('${event.target.result}'); background-size: cover;"></div>
            <div class="text-container">
                <h2>Item lost: ${itemLost}</h2>
                <p>Last seen: ${lastSeen}</p>
                <p>Owner: ${name}</p>
                <p>Contact info: ${contactInfo}</p>
            </div>
        `;
        lostContainer.appendChild(boxDiv);
        boxCount++;
        e.target.reset();
    };
    if (photoFile) {
        reader.readAsDataURL(photoFile);
    }
});

function ordinal(n) {
    if (n % 10 === 1 && n % 100 !== 11) return n + "st";
    if (n % 10 === 2 && n % 100 !== 12) return n + "nd";
    if (n % 10 === 3 && n % 100 !== 13) return n + "rd";
    return n + "th";
}
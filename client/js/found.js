document.addEventListener('DOMContentLoaded', function () {
    const starCount = 100;
    const shootingStarCount = 500;
    const starsContainer = document.querySelector('.stars');
    const shootingStarsContainer = document.querySelector('.shooting-stars');

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDuration = Math.random() * 1.5 + 0.5 + 's';
        starsContainer.appendChild(star);
    }

    for (let i = 0; i < shootingStarCount; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.top = Math.random() * 100 + 'vh';
        shootingStar.style.left = Math.random() * 100 + 'vw';
        shootingStar.style.animationDelay = Math.random() * 3 + 's';
        shootingStar.style.animationDuration = Math.random() * 2 + 1 + 's';
        shootingStarsContainer.appendChild(shootingStar);
    }

    const form = document.querySelector('.found-form');
    const container = document.querySelector('.found-container');

    async function loadItems() {
        try {
            const response = await fetch('http://localhost:5000/api/items/found');
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            renderItems(items);
            document.body.classList.add('loaded');
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Failed to load items. Please try again later.');
        }
    }

    function renderItems(items) {
        container.innerHTML = '';
        items.forEach(item => {
            const itemElement = createItemElement(item);
            container.appendChild(itemElement);
        });
    }

    function createItemElement(item) {
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.id = item._id;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'box-image';

        if (item.imageUrl) {
            imageDiv.style.backgroundImage = `url('${item.imageUrl}')`;
            imageDiv.style.backgroundSize = 'cover';
        } else {
            imageDiv.style.backgroundColor = '#f0f0f0';
            imageDiv.style.display = 'flex';
            imageDiv.style.alignItems = 'center';
            imageDiv.style.justifyContent = 'center';
            imageDiv.innerHTML = '<span>No Image Available</span>';
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'text-container';
        
        // Create more descriptive text when fields are empty
        const itemName = item.itemName ? item.itemName : 'Unknown item';
        const location = item.location ? item.location : 'Location not specified';
        const ownerName = item.name ? item.name : 'Owner not specified';
        const contactInfo = item.contactInfo ? item.contactInfo : 'Contact information not provided';
        const description = item.description ? item.description : 'No description provided';

        textDiv.innerHTML = `
            <h2>${itemName}</h2>
            <p><strong>Last seen:</strong> ${location}</p>
            <p><strong>Owner:</strong> ${ownerName}</p>
            <p><strong>Contact info:</strong> ${contactInfo}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button class="delete-btn">Delete</button>
        `;

        box.appendChild(imageDiv);
        box.appendChild(textDiv);

        box.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this item?')) {
                try {
                    const response = await fetch(`http://localhost:5000/api/items/${item._id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error('Failed to delete item');
                    box.remove();
                } catch (error) {
                    console.error('Error deleting item:', error);
                    alert('Failed to delete item. Please try again.');
                }
            }
        });

        return box;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.append('type', 'found');

        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to submit item');

            const newItem = await response.json();
            const itemElement = createItemElement(newItem);
            container.prepend(itemElement);
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    });

    loadItems();
});
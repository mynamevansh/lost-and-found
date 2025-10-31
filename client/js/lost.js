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

    const form = document.querySelector('.lost-form');
    const container = document.querySelector('.lost-container');

    async function loadItems() {
        try {
            const response = await fetch('http://localhost:5000/api/items/lost');
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            renderItems(items);
            document.body.classList.add('loaded');
        } catch (error) {
            console.error('❌ Error loading items:', error);
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
        const token = localStorage.getItem('userToken');
        const currentUserId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.id = item._id;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'box-image';

        // Handle image URL - ensure correct path with backend URL
        if (item.imageUrl) {
            const imageUrl = item.imageUrl.startsWith('http') 
                ? item.imageUrl 
                : `http://localhost:5000${item.imageUrl}`;
            
            imageDiv.style.backgroundImage = `url('${imageUrl}')`;
            imageDiv.style.backgroundSize = 'cover';
            imageDiv.style.backgroundPosition = 'center';
            imageDiv.style.backgroundRepeat = 'no-repeat';
        } else {
            imageDiv.style.backgroundColor = '#f0f0f0';
            imageDiv.style.display = 'flex';
            imageDiv.style.alignItems = 'center';
            imageDiv.style.justifyContent = 'center';
            imageDiv.innerHTML = '<span style="color: #999;">No Image Available</span>';
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'text-container';
        
        // Use actual data or fallback only for missing fields
        const itemName = item.itemName && item.itemName.trim() 
            ? item.itemName.trim() 
            : 'Unknown item';
        
        const location = item.location && item.location.trim() 
            ? item.location.trim() 
            : 'Location not specified';
        
        const ownerName = item.name && item.name.trim() 
            ? item.name.trim() 
            : 'Owner not specified';
        
        const contactInfo = item.contactInfo && item.contactInfo.trim() 
            ? item.contactInfo.trim() 
            : 'Contact information not provided';
        
        const description = item.description && item.description.trim() 
            ? item.description.trim() 
            : 'No description provided';
        
        const canDelete = (currentUserId && item.user && item.user.toString() === currentUserId) || 
                          (userEmail === 'vanshranawat48@gmail.com');

        textDiv.innerHTML = `
            <h2>${itemName}</h2>
            <p><strong>Last seen:</strong> ${location}</p>
            <p><strong>Owner:</strong> ${ownerName}</p>
            <p><strong>Contact info:</strong> ${contactInfo}</p>
            <p><strong>Description:</strong> ${description}</p>
            ${canDelete ? '<button class="delete-btn">Delete</button>' : ''}
        `;

        box.appendChild(imageDiv);
        box.appendChild(textDiv);

        if (canDelete) {
            const deleteBtn = box.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this item?')) {
                        try {
                            const response = await fetch(`http://localhost:5000/api/items/${item._id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Failed to delete item');
                            }
                            box.remove();
                            alert('Item deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            alert('Failed to delete item: ' + error.message);
                        }
                    }
                });
            }
        }

        return box;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('You must be logged in to report a lost item.');
            window.location.href = 'index.html';
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:5000/api/items/lost', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit item');
            }

            const newItem = await response.json();
            const itemElement = createItemElement(newItem);
            container.prepend(itemElement);
            form.reset();
            
            alert('Lost item reported successfully!');
        } catch (error) {
            console.error('❌ Error submitting form:', error);
            alert('Error submitting form: ' + error.message);
        }
    });

    loadItems();
});
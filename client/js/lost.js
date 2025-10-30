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
            console.log('📥 Fetching lost items from backend...');
            const response = await fetch('http://localhost:5000/api/items/lost');
            if (!response.ok) throw new Error('Network response was not ok');
            const items = await response.json();
            
            console.log('✅ Received', items.length, 'lost items from backend');
            console.log('📦 Raw items data:', items);
            
            // Log first item structure for debugging
            if (items.length > 0) {
                console.log('🔍 First item structure:');
                console.log('  _id:', items[0]._id);
                console.log('  itemName:', items[0].itemName);
                console.log('  location:', items[0].location);
                console.log('  name:', items[0].name);
                console.log('  contactInfo:', items[0].contactInfo);
                console.log('  description:', items[0].description);
                console.log('  imageUrl:', items[0].imageUrl);
            }
            
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
        console.log('🎨 Creating card for item:', item._id);
        console.log('  Raw item data:', item);
        
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
            
            console.log('  🖼️ Image URL:', imageUrl);
        } else {
            imageDiv.style.backgroundColor = '#f0f0f0';
            imageDiv.style.display = 'flex';
            imageDiv.style.alignItems = 'center';
            imageDiv.style.justifyContent = 'center';
            imageDiv.innerHTML = '<span style="color: #999;">No Image Available</span>';
            console.log('  📷 No image uploaded');
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
        
        console.log('  📝 Display values:');
        console.log('    Item Name:', itemName);
        console.log('    Location:', location);
        console.log('    Owner:', ownerName);
        console.log('    Contact:', contactInfo);
        console.log('    Description:', description.substring(0, 50) + '...');

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
        
        // Debug: Log form data to verify all fields are captured
        console.log('📝 Submitting Lost Item:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        try {
            const response = await fetch('http://localhost:5000/api/items/lost', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit item');
            }

            const newItem = await response.json();
            
            // Debug: Log received item from backend
            console.log('✅ Item saved successfully:', newItem);
            console.log('  Item Name:', newItem.itemName);
            console.log('  Location:', newItem.location);
            console.log('  Owner:', newItem.name);
            console.log('  Contact:', newItem.contactInfo);
            console.log('  Description:', newItem.description);
            console.log('  Image URL:', newItem.imageUrl);
            
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
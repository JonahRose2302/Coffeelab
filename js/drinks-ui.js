/**
 * UI Logic for Drinks Page
 */

const grid = document.getElementById('drinks-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-drink-btn');
const closeBtn = document.getElementById('close-modal');
const form = document.getElementById('drink-form');
const imageInput = document.getElementById('drink-image');

// Render Drinks
function renderDrinks() {
    const drinks = window.RecipeManager.getDrinks();
    grid.innerHTML = '';

    if (drinks.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    drinks.forEach(drink => {
        const card = document.createElement('div');
        card.className = 'glass-panel drink-card';
        // Remove padding from card since content has padding, 
        // effectively resetting panel styles specifically for image layout
        card.style.padding = '0';

        const imgHtml = drink.image
            ? `<img src="${drink.image}" class="drink-img" alt="${drink.title}">`
            : `<div class="drink-img" style="background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>`;

        card.innerHTML = `
            ${imgHtml}
            <div class="drink-content">
                <h3 style="color: var(--accent-color);">${drink.title}</h3>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem; white-space: pre-wrap;">${drink.description || ''}</p>
                <button class="delete-btn" data-id="${drink.id}" style="margin-top: 1rem; background: transparent; border: 1px solid #ff4444; color: #ff4444; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: none; font-size: 0.8rem;">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Attach listeners to new buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (confirm('Delete this drink?')) {
                window.RecipeManager.deleteDrink(id);
                renderDrinks();
            }
        });
    });
}

// Modal Toggle
addBtn.addEventListener('click', () => {
    modal.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
});

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
});

// Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const drink = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description'),
        image: null
    };

    // Handle Image
    if (imageInput.files && imageInput.files[0]) {
        try {
            drink.image = await convertToBase64(imageInput.files[0]);
        } catch (err) {
            console.error(err);
            alert('Error processing image');
            return;
        }
    }

    window.RecipeManager.saveDrink(drink);
    renderDrinks();
    form.reset();
    modal.classList.remove('open');
});

// Helper: File to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Init
document.addEventListener('DOMContentLoaded', renderDrinks);

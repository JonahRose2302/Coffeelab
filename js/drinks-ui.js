/**
 * UI Logic for Drinks Page
 * Capsule Grid Layout & Edit Functionality
 */

const drinksGrid = document.getElementById('drinks-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('drink-modal');
const addBtn = document.getElementById('add-drink-btn');
const closeBtn = document.getElementById('close-modal');
const form = document.getElementById('drink-form');
const imageInput = document.getElementById('drink-image');
const modalTitle = document.getElementById('modal-title');
const saveBtn = document.getElementById('modal-save-btn');

let isEditMode = false;
let currentEditId = null;

// Render Drinks as Capsules
function renderDrinks() {
    const drinks = window.RecipeManager.getDrinks();
    drinksGrid.innerHTML = '';

    if (drinks.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Sort by newest first (optional, matches Brew Log feel)
    drinks.sort((a, b) => b.id - a.id).forEach(drink => {
        const card = document.createElement('div');
        // Reusing brew-capsule class for consistent animation/style
        card.className = 'glass-panel brew-capsule';
        card.style.padding = '0';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';

        // Header (Always Visible)
        const header = `
            <div class="card-header" style="padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="width: 40px; height: 40px; background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                         ${drink.title ? drink.title.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--md-sys-color-on-surface); transform: translateY(2px);">${drink.title}</h3>
                         <div style="font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant);">
                           Recipe
                        </div>
                    </div>
                </div>
                <div style="transform: rotate(0deg); transition: transform 0.3s;" class="expand-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        `;

        // Details (Hidden)
        const details = `
             <div class="card-details" style="display: none; padding: 0 2rem 1.5rem 2rem; border-top: 1px solid var(--md-sys-color-outline-variant);">
                <div style="margin-top: 1rem;">
                    ${drink.image ? `<img src="${drink.image}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : ''}
                    <p style="white-space: pre-wrap; opacity: 0.8; line-height: 1.6; color: var(--md-sys-color-on-surface);">
                        ${drink.description || 'No description provided.'}
                    </p>
                </div>
                <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                     <button class="glass-btn edit-btn" style="padding: 0.5rem 1.2rem; font-size: 0.9rem; background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); box-shadow: none;">Edit</button>
                     <button class="glass-btn delete-btn" style="padding: 0.5rem 1.2rem; font-size: 0.9rem; background: transparent; border: 1px solid var(--md-sys-color-error); color: var(--md-sys-color-error); box-shadow: none;">Delete</button>
                </div>
            </div>
        `;

        card.innerHTML = header + details;

        // Interaction Logic
        const headerNode = card.querySelector('.card-header');
        const detailsNode = card.querySelector('.card-details');
        const iconNode = card.querySelector('.expand-icon');

        headerNode.addEventListener('click', () => {
            const isExpanded = detailsNode.style.display === 'block';

            // Close others? Optional. Let's keep manual control.

            if (isExpanded) {
                detailsNode.style.display = 'none';
                iconNode.style.transform = 'rotate(0deg)';
                card.classList.remove('expanded');
            } else {
                detailsNode.style.display = 'block';
                iconNode.style.transform = 'rotate(180deg)';
                card.classList.add('expanded');
            }
        });

        // Edit
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(drink);
        });

        // Delete
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this drink?')) {
                window.RecipeManager.deleteDrink(drink.id);
                renderDrinks();
            }
        });

        drinksGrid.appendChild(card);
    });
}

// Modal Logic
function openAddModal() {
    isEditMode = false;
    currentEditId = null;
    modalTitle.innerText = "Add Drink";
    saveBtn.innerText = "Save Drink";
    form.reset();
    modal.classList.add('open');
}

function openEditModal(drink) {
    isEditMode = true;
    currentEditId = drink.id;
    modalTitle.innerText = "Edit Drink";
    saveBtn.innerText = "Update Drink";

    // Populate Form
    form.elements['name'].value = drink.title || '';
    form.elements['description'].value = drink.description || '';
    // Image cannot be set on file input, but we could show a preview if we wanted. 
    // For now, if they upload a new one it replaces the old one.

    modal.classList.add('open');
}

addBtn.addEventListener('click', openAddModal);

closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
});

// Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!window.RecipeManager) {
        alert("Error: RecipeManager not loaded");
        return;
    }

    const formData = new FormData(form);

    // Base object
    const drinkData = {
        title: formData.get('name'),
        description: formData.get('description')
    };

    // Handle Image
    if (imageInput.files && imageInput.files[0]) {
        try {
            drinkData.image = await convertToBase64(imageInput.files[0]);
        } catch (err) {
            console.error("Image error", err);
            alert('Error processing image');
            return;
        }
    } else if (isEditMode) {
        // Keep existing image if no new one uploaded
        const existing = window.RecipeManager.getDrinks().find(d => d.id === currentEditId);
        if (existing) {
            drinkData.image = existing.image;
        }
    }

    if (isEditMode && currentEditId) {
        window.RecipeManager.updateDrink(currentEditId, drinkData);
    } else {
        drinkData.id = Date.now();
        window.RecipeManager.saveDrink(drinkData);
    }

    renderDrinks();
    form.reset();
    modal.classList.remove('open');
});

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

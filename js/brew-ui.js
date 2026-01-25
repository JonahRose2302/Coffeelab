/**
 * UI Logic for Brew Page (Overhauled)
 * Handles List View, Expandable Cards, Bean Age, and Modal CRUD.
 */

const brewGrid = document.getElementById('brew-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('brew-modal');
const form = document.getElementById('brew-form');
const addBtn = document.getElementById('add-brew-btn');
const closeBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const saveBtn = document.getElementById('modal-save-btn');

let isEditMode = false;
let currentEditId = null;

// --- Rendering ---

function renderBrews() {
    const brews = window.RecipeManager.getRecipes();
    brewGrid.innerHTML = '';

    console.log("Rendering brews:", brews);

    if (brews.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Sort by newest first
    brews.sort((a, b) => b.id - a.id).forEach(brew => {
        const card = createBrewCard(brew);
        brewGrid.appendChild(card);
    });
}

function createBrewCard(brew) {
    const card = document.createElement('div');
    // Using new brew-capsule class for shape
    card.className = 'glass-panel brew-capsule';
    card.style.padding = '0'; // Custom padding
    card.style.cursor = 'pointer';
    card.style.transition = 'all 0.3s ease';

    // Calculate Bean Age
    let ageString = "Unknown Age";
    let ageColor = "var(--md-sys-color-on-surface-variant)";

    if (brew.roastDate) {
        const roast = new Date(brew.roastDate);
        const today = new Date();
        const diffTime = today - roast; // Diff in ms
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (!isNaN(diffDays)) {
            ageString = `${diffDays} days`;

            // Color coding
            if (diffDays < 7) ageColor = "var(--md-sys-color-primary)"; // Fresh
            else if (diffDays > 30) ageColor = "var(--md-sys-color-error)"; // Old
            else ageColor = "var(--md-sys-color-secondary)"; // Peak
        }
    }

    // Compact View (Capsule)
    const header = `
        <div class="card-header" style="padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="width: 40px; height: 40px; background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                     ${brew.beanName ? brew.beanName.charAt(0).toUpperCase() : 'B'}
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 1.1rem; color: var(--md-sys-color-on-surface); transform: translateY(2px);">${brew.beanName || 'Unknown Bean'}</h3>
                    <div style="font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant);">
                        <span style="color: ${ageColor}; font-weight: 600;">${ageString}</span> • ${brew.dose || '?'}g in, ${brew.ratio ? (brew.dose * brew.ratio).toFixed(1) : '?'}g out
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

    // Expanded Details
    const details = `
        <div class="card-details" style="display: none; padding: 0 2rem 1.5rem 2rem; border-top: 1px solid var(--md-sys-color-outline-variant);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div>
                    <strong style="display: block; font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase; color: var(--md-sys-color-secondary);">Grinder</strong>
                    <div>${brew.grindSize || '--'} <span style="font-size: 0.8em; opacity: 0.8;">@ ${brew.rpm || '?'} RPM</span></div>
                </div>
                <div>
                    <strong style="display: block; font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase; color: var(--md-sys-color-secondary);">Ratio</strong>
                    <div>1:${brew.ratio || '--'}</div>
                </div>
            </div>

            <div style="margin-top: 1rem;">
                <strong style="display: block; font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase; color: var(--md-sys-color-secondary);">Profile</strong>
                <div>Peak: ${brew.peakBar}bar -> ${brew.peakWeight}g</div>
                ${brew.preinfusionBar ? `<div>Pre-inf: ${brew.preinfusionBar}bar -> ${brew.preinfusionWeight}g</div>` : ''}
                ${brew.taperingBar ? `<div>Taper: ${brew.taperingBar}bar -> ${brew.taperingWeight}g</div>` : ''}
            </div>

            <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                 <button class="glass-btn edit-btn" style="padding: 0.5rem 1.2rem; font-size: 0.9rem; background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); box-shadow: none;">Edit</button>
                 <button class="glass-btn delete-btn" style="padding: 0.5rem 1.2rem; font-size: 0.9rem; background: transparent; border: 1px solid var(--md-sys-color-error); color: var(--md-sys-color-error); box-shadow: none;">Delete</button>
            </div>
        </div>
    `;

    card.innerHTML = header + details;

    // Expand Logic
    const headerNode = card.querySelector('.card-header');
    const detailsNode = card.querySelector('.card-details');
    const iconNode = card.querySelector('.expand-icon');

    headerNode.addEventListener('click', (e) => {
        const isExpanded = detailsNode.style.display === 'block';

        if (isExpanded) {
            // Collapse
            detailsNode.style.display = 'none';
            iconNode.style.transform = 'rotate(0deg)';
            card.classList.remove('expanded');
        } else {
            // Expand
            detailsNode.style.display = 'block';
            iconNode.style.transform = 'rotate(180deg)';
            card.classList.add('expanded');
        }
    });

    // Action Buttons
    card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(brew);
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this brew log?')) {
            window.RecipeManager.deleteRecipe(brew.id);
            renderBrews();
        }
    });

    return card;
}

// --- Modal Logic ---

function openAddModal() {
    isEditMode = false;
    currentEditId = null;
    modalTitle.innerText = "New Extraction";
    saveBtn.innerText = "Save Brew";
    form.reset();
    document.getElementById('preinfusion-fields').style.display = 'none';
    document.getElementById('tapering-fields').style.display = 'none';
    modal.classList.add('open');
}

function openEditModal(brew) {
    isEditMode = true;
    currentEditId = brew.id;
    modalTitle.innerText = "Edit Extraction";
    saveBtn.innerText = "Update Brew";

    // Populate
    for (const [key, value] of Object.entries(brew)) {
        const input = form.elements[key];
        if (input && input.type !== 'file') { // skip files if any
            if (input.type === 'checkbox') {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
            } else {
                input.value = value;
            }
        }
    }

    // Manual overrides for hidden sections if values exist
    if (brew.preinfusionBar) {
        document.getElementById('preinfusion-check').checked = true;
        document.getElementById('preinfusion-fields').style.display = 'block';
    }
    if (brew.taperingBar) {
        document.getElementById('tapering-check').checked = true;
        document.getElementById('tapering-fields').style.display = 'block';
    }

    modal.classList.add('open');
}

addBtn.addEventListener('click', openAddModal);
closeBtn.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

// Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (isEditMode && currentEditId) {
        window.RecipeManager.updateRecipe(currentEditId, data);
    } else {
        data.id = Date.now();
        data.createdDate = new Date().toISOString();
        window.RecipeManager.saveRecipe(data);
    }

    modal.classList.remove('open');
    renderBrews();
});

// Init
document.addEventListener('DOMContentLoaded', renderBrews);

// Yield Calc
const dose = document.getElementById('dose-input');
const ratio = document.getElementById('ratio-input');
const yieldDisplay = document.getElementById('yield-calc');

function updateYield() {
    if (dose.value && ratio.value) {
        yieldDisplay.innerText = `Target Yield: ${(dose.value * ratio.value).toFixed(1)} g`;
    } else {
        yieldDisplay.innerText = "Target Yield: -- g";
    }
}
dose.addEventListener('input', updateYield);
ratio.addEventListener('input', updateYield);

// Conditional UI
document.getElementById('preinfusion-check').addEventListener('change', (e) => {
    document.getElementById('preinfusion-fields').style.display = e.target.checked ? 'block' : 'none';
});
document.getElementById('tapering-check').addEventListener('change', (e) => {
    document.getElementById('tapering-fields').style.display = e.target.checked ? 'block' : 'none';
});

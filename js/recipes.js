/**
 * Recipe Management Logic
 * Handles saving to LocalStorage and exporting to JSON
 */

const STORAGE_KEY = 'coffee_lab_recipes';
const DRINKS_KEY = 'coffee_lab_drinks';

// --- Brew Form Logic ---
// --- Brew Form Logic ---
// Removed to allow separate UI modules to handle interactions.
// Use RecipeManager methods below.

function saveRecipe(recipe) {
    const recipes = getRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getRecipes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function updateRecipe(id, updatedData) {
    let recipes = getRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
        recipes[index] = { ...recipes[index], ...updatedData, id: id }; // Ensure ID persists
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
}

function deleteRecipe(id) {
    let recipes = getRecipes();
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}


// --- Drinks Logic ---

// Save Drink
function saveDrink(drink) {
    const drinks = getDrinks();
    drinks.push(drink);
    localStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
}

function getDrinks() {
    const stored = localStorage.getItem(DRINKS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function deleteDrink(id) {
    let drinks = getDrinks();
    drinks = drinks.filter(d => d.id !== id);
    localStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
}

function updateDrink(id, updatedData) {
    let drinks = getDrinks();
    const index = drinks.findIndex(d => d.id === id);
    if (index !== -1) {
        drinks[index] = { ...drinks[index], ...updatedData, id: id };
        localStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
    }
}

// Export for other modules if needed (using global scope for simplicity in this stack)
window.RecipeManager = {
    saveRecipe,
    getRecipes,
    updateRecipe,
    deleteRecipe,
    saveDrink,
    getDrinks,
    updateDrink,
    deleteDrink
};

// --- Data Seeding (Mock Data for fresh devices) ---
function seedDefaults() {
    if (getRecipes().length === 0) {
        console.log("Seeding default brew...");
        const defaultBrew = {
            id: Date.now(),
            createdDate: new Date().toISOString(),
            beanName: "Brasilien",
            roastDate: new Date().toISOString().split('T')[0],
            grindSize: "14.5",
            rpm: "1000",
            dose: "18",
            ratio: "2.5",
            peakBar: "9",
            peakWeight: "36"
        };
        saveRecipe(defaultBrew);
    }

    if (getDrinks().length === 0) {
        console.log("Seeding default drink...");
        const defaultDrink = {
            id: Date.now(),
            title: "Cappuccino",
            description: "Double shot of Brasilien espresso with micro-textured milk.",
            image: null // User can add one
        };
        saveDrink(defaultDrink);
    }
}

// Bulk Import for Sharing
function importData(recipes, drinks) {
    if (recipes && Array.isArray(recipes)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
    if (drinks && Array.isArray(drinks)) {
        localStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
    }
}

window.RecipeManager = {
    saveRecipe,
    getRecipes,
    updateRecipe,
    deleteRecipe,
    saveDrink,
    getDrinks,
    updateDrink,
    deleteDrink,
    importData // Exporting new function
};

// Run seeding logic
seedDefaults();

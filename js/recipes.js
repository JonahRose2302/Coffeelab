/**
 * Recipe Management Logic
 * Handles saving to LocalStorage and exporting to JSON
 */

const STORAGE_KEY = 'coffee_lab_recipes';
const DRINKS_KEY = 'coffee_lab_drinks';

// --- Brew Form Logic ---
const brewForm = document.getElementById('brew-form');

if (brewForm) {
    brewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(brewForm);
        const recipe = Object.fromEntries(formData.entries());

        // Add timestamp and ID
        recipe.id = Date.now();
        recipe.date = new Date().toISOString();

        // Save to LocalStorage
        saveRecipe(recipe);

        alert('Brew saved locally!');
        brewForm.reset();
    });

    document.getElementById('download-json').addEventListener('click', () => {
        const recipes = getRecipes();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recipes, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "coffee_lab_recipes.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}

function saveRecipe(recipe) {
    const recipes = getRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getRecipes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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
    // Trigger UI refresh if callback provided? 
    // For now simple reload or caller handles it
}

// Export for other modules if needed (using global scope for simplicity in this stack)
window.RecipeManager = {
    saveRecipe,
    getRecipes,
    saveDrink,
    getDrinks,
    deleteDrink
};

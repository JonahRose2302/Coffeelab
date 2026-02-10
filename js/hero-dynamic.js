/**
 * Dynamic Hero Content
 * Fetches the latest brew from LocalStorage and updates the Hero Headline/Stats.
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'coffee_lab_recipes';

    // Elements - checking if they exist to avoid errors
    const headline = document.getElementById('hero-headline');
    // Note: The highlight span is inside the headline, so we might need to recreate it or target it if it exists.
    // Easier to just replace the innerHTML of the headline.
    const techLabel = document.getElementById('hero-tech-label');

    function getLatestBrew() {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return null;
        try {
            const recipes = JSON.parse(json);
            if (!Array.isArray(recipes) || recipes.length === 0) return null;

            // Sort by createdDate desc (Newest first)
            recipes.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            return recipes[0];
        } catch (e) {
            console.error("Error reading recipes", e);
            return null;
        }
    }

    const latest = getLatestBrew();

    if (latest) {
        console.log("Latest brew found:", latest.beanName);

        // Update Headline
        if (headline) {
            // Safe Bean Name
            const name = latest.beanName ? latest.beanName.toUpperCase() : "UNKNOWN BEAN";
            // Highlight: Use Peak Bar if available, else Temp (default 94)
            const stat = latest.peakBar ? `${latest.peakBar} BAR` : '94°C';

            headline.innerHTML = `${name}<br><span class="highlight">${stat}</span>`;
        }

        // Update Tech Label
        if (techLabel) {
            // Calculate Roast Age for extra tech feel
            let ageTxt = "";
            if (latest.roastDate) {
                const diff = Math.floor((new Date() - new Date(latest.roastDate)) / (1000 * 60 * 60 * 24));
                ageTxt = `AGE: ${diff} DAYS`;
            }

            techLabel.innerHTML = `
                BEAN: ${latest.beanName || 'N/A'}<br>
                ${latest.roastDate ? `ROAST: ${latest.roastDate}` : 'ROAST: N/A'}<br>
                GRIND: ${latest.grindSize || '--'} / RATIO: 1:${latest.ratio || '--'}
            `;
        }
    } else {
        console.log("No brews found.");
        // Default State "BRÜH MAL JETZT"
        if (headline) {
            headline.innerHTML = `BRÜH MAL<br><span class="highlight">JETZT</span>`;
        }
        if (techLabel) {
            techLabel.innerHTML = `
                STATUS: NO DATA DETECTED<br>
                ACTION: START BREW LOG<br>
                LOC: 51.5°N, 0.1°W
            `;
        }
    }
});

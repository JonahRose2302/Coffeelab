/**
 * Share System
 * Compresses LocalStorage data into a URL hash for sharing.
 * Dependencies: lz-string (https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check for shared data on load
    checkForSharedData();

    // 2. Setup Share UI
    const nav = document.querySelector('nav');
    if (nav) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'nav-link matrix-effect';
        shareBtn.innerHTML = '🔗 Share'; // Simple icon
        shareBtn.style.background = 'transparent';
        shareBtn.style.border = '1px solid var(--md-sys-color-primary)';
        shareBtn.style.color = 'var(--md-sys-color-primary)';
        shareBtn.style.cursor = 'pointer';
        shareBtn.style.marginLeft = '1rem';

        shareBtn.addEventListener('click', generateShareLink);
        nav.appendChild(shareBtn);
    }
});

function generateShareLink() {
    if (!window.LZString) {
        alert("Sync library not loaded yet. Please wait.");
        return;
    }

    const recipes = window.RecipeManager.getRecipes();
    const drinks = window.RecipeManager.getDrinks();

    // Create payload
    const payload = JSON.stringify({ r: recipes, d: drinks });

    // Compress
    const compressed = window.LZString.compressToEncodedURIComponent(payload);

    // Build URL
    const url = new URL(window.location.href);
    url.hash = 'import=' + compressed;

    // Copy to clipboard
    navigator.clipboard.writeText(url.toString()).then(() => {
        alert("🔗 Link copied to clipboard!\n\nSend this to your other device to sync your data.");
    }).catch(err => {
        console.error('Failed to copy: ', err);
        prompt("Copy this link to share:", url.toString());
    });
}

function checkForSharedData() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#import=')) {
        if (!window.LZString) {
            // Retry shortly if lib not ready
            setTimeout(checkForSharedData, 100);
            return;
        }

        if (confirm("📥 Import data from shared link?\n\nThis will overwrite your current local data.")) {
            try {
                const compressed = hash.replace('#import=', '');
                const decompressed = window.LZString.decompressFromEncodedURIComponent(compressed);
                const data = JSON.parse(decompressed);

                if (data.r || data.d) {
                    window.RecipeManager.importData(data.r || [], data.d || []);
                    alert("✅ Data imported successfully!");
                    // Clear hash
                    history.replaceState(null, null, ' ');
                    // Reload to update UI
                    window.location.reload();
                }
            } catch (e) {
                console.error("Import failed", e);
                alert("❌ Error importing data. Link might be broken.");
            }
        }
    }
}

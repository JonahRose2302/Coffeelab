/**
 * Global Haptics & UI Polish
 * Adds vibration feedback to all interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, .tactile-card, .nav-link, .fab');

    interactiveElements.forEach(el => {
        // Add click vibration
        el.addEventListener('click', () => {
            if ("vibrate" in navigator) {
                navigator.vibrate(50); // Light tick
            }
        });

        // Add subtle hover vibration (very short) - experimental/optional
        // el.addEventListener('mouseenter', () => {
        //     if ("vibrate" in navigator) {
        //         navigator.vibrate(5); 
        //     }
        // });
    });

    console.log("Haptics initialized on", interactiveElements.length, "elements.");
});




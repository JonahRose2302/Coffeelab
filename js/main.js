/**
 * Main JavaScript file for Shared Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Coffee App Initialized");

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Navigation Toggle (if we add it later)
    // currently just using the simple nav in index.html
});

/**
 * Interactive Steam Animation
 * Generates procedural steam and applies wind effect based on mouse x position.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('vapour-container');
    const vapeurCount = 15;

    // 1. Generate procedural steam
    container.innerHTML = ''; // Clear fallback
    for (let i = 0; i < vapeurCount; i++) {
        const span = document.createElement('span');
        span.className = 'vapour';

        // Randomize animation delay (-20s to 0s) to make it look continuous
        span.style.animationDelay = `${(Math.random() * -5) - 1}s`;

        // Randomize duration slightly
        span.style.animationDuration = `${2 + Math.random()}s`;

        // Slight random horizontal offset
        const xOffset = (Math.random() - 0.5) * 50;
        span.style.left = `${xOffset}px`;

        container.appendChild(span);
    }

    // 2. Wind Effect
    // Adjust the skew/translation of the container based on mouse position relative to center
    const cup = document.getElementById('cup');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const centerX = window.innerWidth / 2;
        const deltaX = x - centerX;

        // Max wind force
        const force = deltaX / centerX; // -1 to 1

        // Apply skew to steam
        container.style.transition = 'transform 0.5s ease-out';
        container.style.transform = `skewX(${force * -20}deg) translateX(${force * -10}px)`;

        // Rotate cup slightly
        cup.style.transition = 'transform 0.5s ease-out';
        cup.style.transform = `rotateY(${force * 10}deg)`;
    });
});

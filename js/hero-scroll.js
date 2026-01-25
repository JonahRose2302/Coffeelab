/**
 * Magazine Hero Scroll Effect
 * Maps scroll position to Variable Font settings (Weight & Width).
 */

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.magazine-hero');
    const headline = document.querySelector('.hero-headline');
    const heroImg = document.querySelector('.hero-img');

    if (!heroSection || !headline) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate progress (0 to 1) over the first 70% of the viewport height
        let progress = scrollY / (windowHeight * 0.7);
        if (progress > 1) progress = 1;

        // 1. Variable Font Animation (Simulating Pressure)
        // Weight: 300 (Light) -> 1000 (Black)
        // Width: 100 (Standard) -> 150 (Wide)
        // Optical Size: 14 -> 144 (for crispness at large sizes)

        const weight = 300 + (progress * 700); // 300 to 1000
        const width = 100 + (progress * 50);   // 100 to 150

        headline.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}, 'opsz' 144`;

        // 2. Parallax / Depth Effect
        // Headline moves slower than image
        headline.style.transform = `translateY(${scrollY * 0.2}px)`;

        // Image slight scale down? Or stick to static "Coffee Table" look?
        // Let's keep image static or very slight movement for 3D feel.
        if (heroImg) {
            heroImg.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 - progress * 0.05})`;
        }

    }, { passive: true });
});

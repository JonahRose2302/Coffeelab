/**
 * Simple Matrix Digital Rain Effect for Text
 * Runs ONCE on load to decode the text, then stops.
 */

class MatrixText {
    constructor(element) {
        this.element = element;
        this.originalText = element.dataset.value || element.innerText;
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
        this.iterations = 0;

        // Start immediately
        this.start();
    }

    start() {
        let interval = setInterval(() => {
            this.element.innerText = this.originalText
                .split("")
                .map((letter, index) => {
                    if (index < this.iterations) {
                        return this.originalText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join("");

            if (this.iterations >= this.originalText.length) {
                clearInterval(interval);
            }

            this.iterations += 1 / 2; // Slower decode for effect
        }, 50);
    }
}

// Initialize on all elements with class .matrix-effect
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure layout is stable
    setTimeout(() => {
        const targets = document.querySelectorAll('.matrix-effect');
        targets.forEach(target => {
            // Store original text in data attribute if not present
            if (!target.dataset.value) target.dataset.value = target.innerText;
            new MatrixText(target);
        });
    }, 100);
});

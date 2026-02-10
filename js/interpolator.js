/**
 * The Dial-In Interpolator Logic
 * Calculates linear interpretation between two coffee shots to find optimal grind size.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calc-btn');
    const resultSection = document.getElementById('result-section');
    const resultDisplay = document.getElementById('result-value');

    calcBtn.addEventListener('click', () => {
        // 1. Haptic Feedback
        if ("vibrate" in navigator) {
            navigator.vibrate(50); // Short click feel
        }

        // 2. Gather Inputs
        const targetTime = parseFloat(document.getElementById('target-time').value) || 30;

        const g1 = parseFloat(document.getElementById('g1').value);
        const t1 = parseFloat(document.getElementById('t1').value);

        const g2 = parseFloat(document.getElementById('g2').value);
        const t2 = parseFloat(document.getElementById('t2').value);

        // Validation
        if (isNaN(g1) || isNaN(t1) || isNaN(g2) || isNaN(t2)) {
            alert("Please enter valid numbers for both shots.");
            return;
        }

        if (g1 === g2) {
            alert("Grind sizes must be different to calculate a slope.");
            return;
        }

        // 3. Calculation
        // Slope m = Change in Time / Change in Grind
        // How many seconds does the shot change per 1 step of grind?
        const m = (t2 - t1) / (g2 - g1);

        // Identify the "Base" shot (the one closer to target, or simply Shot A)
        // Let's use Shot A as base.
        // Formula: TargetTime = T1 + m * (TargetGrind - G1)
        // (TargetTime - T1) = m * (TargetGrind - G1)
        // (TargetTime - T1) / m = TargetGrind - G1
        // TargetGrind = G1 + (TargetTime - T1) / m

        const deltaT = targetTime - t1;
        const deltaG = deltaT / m;
        const targetGrind = g1 + deltaG;

        // 4. Display Results
        // Round to 1 decimal place for DF64V
        resultDisplay.textContent = targetGrind.toFixed(1);

        // Reveal
        resultSection.style.display = 'block';

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Stronger Haptic for Success
        if ("vibrate" in navigator) {
            setTimeout(() => navigator.vibrate([50, 50, 50]), 200);
        }
    });

    // Add "Push" effect listener for visual feedback if CSS :active isn't enough
    calcBtn.addEventListener('mousedown', () => {
        calcBtn.style.transform = 'scale(0.96)';
    });
    calcBtn.addEventListener('mouseup', () => {
        calcBtn.style.transform = 'scale(1)';
    });
    // Touch support
    calcBtn.addEventListener('touchstart', () => {
        calcBtn.style.transform = 'scale(0.96)';
    });
    calcBtn.addEventListener('touchend', () => {
        calcBtn.style.transform = 'scale(1)';
    });

});

const slider = document.getElementById('coffee-slider');
const valueInput = document.getElementById('coffee-value');
const bloomValue = document.getElementById('bloom-value');
const pourValue = document.getElementById('pour-value');

// Ratio selector logic
const ratioOptions = Array.from(document.querySelectorAll('.ratio-option'));
let selectedRatio = 16; // default (matches .selected in HTML)

// Iced recipe elements
const iceValue = document.getElementById('ice-value');
const icedPour1 = document.getElementById('iced-pour1');
const icedPour2 = document.getElementById('iced-pour2');
const icedPour3 = document.getElementById('iced-pour3');
const icedRatioLabel = document.getElementById('iced-ratio-label');

// Iced ratios mapping
const icedRatios = [
    { name: "Tight", ratio: 9, label: "Tight (1:9)" },
    { name: "Normal", ratio: 10, label: "Normal (1:10)" },
    { name: "Wide", ratio: 11, label: "Wide (1:11)" }
];

function getSelectedRatio() {
    return selectedRatio;
}

// Map hot ratio to iced ratio index
function getIcedRatioIndex() {
    if (selectedRatio === 14) return 0; // tight
    if (selectedRatio === 16) return 1; // normal
    if (selectedRatio === 18) return 2; // wide
    return 1; // default to normal
}

function updateRecipe(grind) {
    if (typeof grind === "undefined") {
        grind = parseInt(slider.value, 10);
    }
    grind = Math.max(10, Math.min(40, Math.round(grind)));
    const ratio = getSelectedRatio();

    // Hot recipe calculations
    const bloom = Math.round(grind * 3);
    const pour = Math.round(grind * ratio);
    valueInput.value = grind;
    bloomValue.textContent = bloom;
    pourValue.textContent = pour;

    // Iced recipe calculations
    const icedIdx = getIcedRatioIndex();
    const iced = icedRatios[icedIdx];
    icedRatioLabel.textContent = iced.label;
    const icedRatio = iced.ratio;

    const ice = Math.round(grind * 4.375);
    const pour1 = Math.round(grind * 3);
    const pour2 = Math.round((grind * icedRatio) * 2 / 3);
    const pour3 = Math.round(grind * icedRatio);

    iceValue.textContent = ice;
    icedPour1.textContent = pour1;
    icedPour2.textContent = pour2;
    icedPour3.textContent = pour3;
}

// Sync slider to number input
slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    valueInput.value = val;
    updateRecipe(val);
});

// Allow typing freely in the number box, only update if valid and don't clamp
valueInput.addEventListener('input', () => {
    let val = parseInt(valueInput.value, 10);
});

// Clamp and sync on blur or enter
valueInput.addEventListener('change', () => {
    let val = parseInt(valueInput.value, 10);
    if (isNaN(val)) val = 10;
    val = Math.max(10, Math.min(40, val));
    valueInput.value = val;
    slider.value = val;
    updateRecipe(val);
});

// Ratio option click event
ratioOptions.forEach(option => {
    option.addEventListener('click', () => {
        ratioOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRatio = parseInt(option.getAttribute('data-ratio'), 10);
        updateRecipe(parseInt(valueInput.value, 10));
    });
});

// Initialize
slider.value = valueInput.value;
updateRecipe(parseInt(slider.value, 10));
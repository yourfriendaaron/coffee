const domElements = {
    slider: document.getElementById('coffee-slider'),
    valueInput: document.getElementById('coffee-value'),
    bloomValue: document.getElementById('bloom-value'),
    pourValue: document.getElementById('pour-value'),
    ratioOptions: Array.from(document.querySelectorAll('.ratio-option')),
    icedRatioLabel: document.getElementById('iced-ratio-label'),
    icedBloom: document.getElementById('iced-bloom'),
    icedPour1: document.getElementById('iced-pour1'),
    icedPour2: document.getElementById('iced-pour2'),
    icedIce: document.getElementById('iced-ice'),
    langToggle: document.getElementById('lang-toggle'),
    gramsLabelText: document.querySelector('.grams-label').childNodes[0],
    ratioText: document.querySelector('.ratio-text'),
    recipeTitles: document.querySelectorAll('.recipe-title'),
    hotRecipeSteps: document.querySelectorAll('.recipe-container ul.recipe-steps')[0].children,
    icedRecipeSteps: document.querySelectorAll('.recipe-container ul.recipe-steps')[1].children,
    infobox: document.querySelector('.infobox'),
};

// Ratio selector logic
let selectedRatio = 16; // default (matches .selected in HTML)

// Iced ratios mapping (tight: 1-11, normal: 1-12, wide: 1-13)
const icedRatios = [
    { name: "Tight", ratio: 11, label: "Tight (1:11)" },
    { name: "Normal", ratio: 12, label: "Normal (1:12)" },
    { name: "Wide", ratio: 13, label: "Wide (1:13)" }
];
const hotToIcedRatioMap = { 14: 0, 16: 1, 18: 2 };

let currentLang = 'en';

function getIcedRatioData() {
    const index = hotToIcedRatioMap[selectedRatio] ?? 1; // Default to normal (index 1)
    return icedRatios[index];
}

function updateRecipe(grind) {
    if (typeof grind === "undefined") {
        grind = parseInt(domElements.slider.value, 10);
    }
    // The value from the input might be NaN if the user deletes the content.
    if (isNaN(grind)) {
        return; // Do nothing if the value is not a number.
    }
    const recipeGrind = Math.round(grind);

    // Hot recipe calculations
    const bloom = Math.round(recipeGrind * 3);
    const pour = Math.round(recipeGrind * selectedRatio);
    domElements.bloomValue.textContent = bloom;
    domElements.pourValue.textContent = pour;

    // Iced recipe calculations (new logic)
    const icedData = getIcedRatioData();
    const icedRatio = icedData.ratio;
    const icedBloom = Math.round(recipeGrind * 3);
    const icedPour1 = Math.round(recipeGrind * icedRatio * 0.625);
    const icedPour2 = Math.round(recipeGrind * icedRatio); 
    const icedIce = Math.round(recipeGrind * icedRatio * 0.25);

    domElements.icedBloom.textContent = icedBloom;
    domElements.icedPour1.textContent = icedPour1;
    domElements.icedPour2.textContent = icedPour2;
    domElements.icedIce.textContent = icedIce;

    // Update iced ratio label in current language (hide in Thai)
    domElements.icedRatioLabel.textContent = currentLang === 'en' ? icedData.label : "";

    // Update dynamic text in recipe steps
    const t = translations[currentLang];
    domElements.icedRecipeSteps[4].innerHTML = t.icedAddIce.replace("{iceAmount}", icedIce);
}

// Sync slider to number input
domElements.slider.addEventListener('input', () => {
    const val = parseInt(domElements.slider.value, 10);
    domElements.valueInput.value = val;
    updateRecipe(val);
});

// Allow typing freely in the number box, only update if valid and don't clamp
domElements.valueInput.addEventListener('input', () => {
    const val = parseInt(domElements.valueInput.value, 10);
    if (!isNaN(val)) {
        // Sync slider (clamping its value) and update recipe with the raw typed value.
        // The input box itself is not clamped until the 'change' event.
        domElements.slider.value = Math.max(10, Math.min(40, val));
        updateRecipe(val);
    }
});

// Clamp and sync on blur or enter
domElements.valueInput.addEventListener('change', () => {
    let val = parseInt(domElements.valueInput.value, 10);
    // If the input is blank or not a number, set to 10
    if (domElements.valueInput.value === "" || isNaN(val)) val = 10;
    val = Math.max(10, Math.min(40, val));
    domElements.valueInput.value = val;
    domElements.slider.value = val;
    updateRecipe(val);
});

// Highlight all text when the grams input is focused
domElements.valueInput.addEventListener('focus', function() {
    this.select();
});

// Ratio option click event
domElements.ratioOptions.forEach(option => {
    option.addEventListener('click', () => {
        domElements.ratioOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRatio = parseInt(option.getAttribute('data-ratio'), 10);
        updateRecipe(parseInt(domElements.valueInput.value, 10));
        setLanguage(currentLang); // update iced ratio label
    });
});

// --- Language toggle logic ---
function setLanguage(lang) { 
    currentLang = lang;
    const t = translations[lang];

    // Grams label
    domElements.gramsLabelText.nodeValue = t.gramsLabel + " ";

    // Ratio text
    domElements.ratioText.textContent = t.ratio;

    // Ratio options
    domElements.ratioOptions[0].innerHTML = t.ratioTight;
    domElements.ratioOptions[1].innerHTML = t.ratioNormal;
    domElements.ratioOptions[2].innerHTML = t.ratioWide;

    // Recipe titles
    domElements.recipeTitles[0].innerHTML = `<span class="fire-emoji">🔥</span>${t.hotRecipe}`;
    domElements.recipeTitles[1].innerHTML = `<span class="ice-emoji">🧊</span>${t.icedRecipe}`;

    // Hot recipe steps
    domElements.hotRecipeSteps[0].childNodes[0].nodeValue = t.bloom + " ";
    domElements.hotRecipeSteps[0].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    domElements.hotRecipeSteps[1].childNodes[0].nodeValue = t.pour + " ";
    domElements.hotRecipeSteps[1].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;

    // Iced recipe steps
    domElements.icedRecipeSteps[0].childNodes[0].nodeValue = t.icedBloom + " ";
    domElements.icedRecipeSteps[0].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    domElements.icedRecipeSteps[1].childNodes[0].nodeValue = t.icedPour1 + " ";
    domElements.icedRecipeSteps[1].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    domElements.icedRecipeSteps[2].childNodes[0].nodeValue = t.icedPour2 + " ";
    domElements.icedRecipeSteps[2].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    domElements.icedRecipeSteps[3].textContent = t.icedSwirl;
    domElements.icedRecipeSteps[4].innerHTML = t.icedAddIce.replace("{iceAmount}", domElements.icedIce.textContent);
    domElements.icedRecipeSteps[5].textContent = t.icedServe;

    // Infobox
    domElements.infobox.innerHTML = `<span class="tip-emoji">✅</span>${t.grindFiner}`;

    // UI elements text
    domElements.langToggle.value = lang;
}

// Language toggle button
domElements.langToggle.addEventListener('change', function(event) {
    const newLang = event.target.value;
    setLanguage(newLang);
    updateRecipe(parseInt(domElements.valueInput.value, 10));
});

function initializeApp() {
    // Set initial language and ensure the dropdown visually resets to English.
    setLanguage('en');

    // Initialize recipe values.
    domElements.slider.value = domElements.valueInput.value; // Set the slider value
    updateRecipe(); // Let updateRecipe read the slider value itself
}

// Using 'load' ensures our script runs after the browser might restore form state,
// guaranteeing the language selector is correctly reset.
window.addEventListener('load', initializeApp);
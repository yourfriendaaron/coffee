const dom = {
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

// Iced recipe elements
const icedRatioLabel = document.getElementById('iced-ratio-label');

// Iced ratios mapping (tight: 1-11, normal: 1-12, wide: 1-13)
const icedRatios = [
    { name: "Tight", ratio: 11, label: "Tight (1:11)" },
    { name: "Normal", ratio: 12, label: "Normal (1:12)" },
    { name: "Wide", ratio: 13, label: "Wide (1:13)" }
];
const hotToIcedRatioMap = { 14: 0, 16: 1, 18: 2 };

const translations = {
    en: {
        gramsLabel: "Grams of coffee",
        ratio: "Ratio",
        ratioTight: "Tight<br>(1:14)",
        ratioNormal: "Normal<br>(1:16)",
        ratioWide: "Wide<br>(1:18)",
        hotRecipe: "Hot Recipe",
        icedRecipe: "Iced Recipe",
        bloom: "Bloom to",
        pour: "Pour to",
        grindFiner: "Grind finer than usual",
        langBtn: "ภาษาไทย",
        icedBloom: "Bloom to",
        icedPour1: "1:00 Pour to",
        icedPour2: "1:45 Pour to",
        icedSwirl: "Swirl to flatten the bed and let it drain completely.",
        icedAddIce: "Add <span id='iced-ice'>{iceAmount}</span> g ice to carafe, stir until cooled.",
        icedServe: "Serve over ice.",
        gramsSuffix: " g"
    },
    th: {
        gramsLabel: "กรัมของกาแฟ",
        ratio: "อัตราส่วน",
        ratioTight: "เข้ม<br>(1:14)",
        ratioNormal: "ปกติ<br>(1:16)",
        ratioWide: "อ่อน<br>(1:18)",
        hotRecipe: "สูตรร้อน",
        icedRecipe: "สูตรเย็น",
        bloom: "บลูมถึง",
        pour: "เทถึง",
        grindFiner: "บดให้ละเอียดกว่าปกติ",
        langBtn: "English",
        icedBloom: "บลูมถึง",
        icedPour1: "1:00 เทถึง",
        icedPour2: "1:45 เทถึง",
        icedSwirl: "เขย่าเล็กน้อยให้หน้ากาแฟเรียบ ปล่อยให้น้ำไหลจนหมด",
        icedAddIce: "เติมน้ำแข็ง <span id='iced-ice'>{iceAmount}</span> กรัม ลงในคาราฟ คนจนเย็น",
        icedServe: "เสิร์ฟใส่น้ำแข็ง",
        gramsSuffix: " กรัม"
    }
};



let currentLang = 'en';

function getIcedRatioData() {
    const index = hotToIcedRatioMap[selectedRatio] ?? 1; // Default to normal (index 1)
    return icedRatios[index];
}

function updateRecipe(grind) {
    if (typeof grind === "undefined") {
        grind = parseInt(dom.slider.value, 10);
    }
    // The value from the input might be NaN if the user deletes the content.
    if (isNaN(grind)) {
        return; // Do nothing if the value is not a number.
    }
    const recipeGrind = Math.round(grind);

    // Hot recipe calculations
    const bloom = Math.round(recipeGrind * 3);
    const pour = Math.round(recipeGrind * selectedRatio);
    dom.bloomValue.textContent = bloom;
    dom.pourValue.textContent = pour;

    // Iced recipe calculations (new logic)
    const icedData = getIcedRatioData();
    const icedRatio = icedData.ratio;
    const icedBloom = Math.round(recipeGrind * 3);
    const icedPour1 = Math.round(recipeGrind * icedRatio * 0.625);
    const icedPour2 = Math.round(recipeGrind * icedRatio);
    const icedIce = Math.round(recipeGrind * icedRatio * 0.25);

    dom.icedBloom.textContent = icedBloom;
    dom.icedPour1.textContent = icedPour1;
    dom.icedPour2.textContent = icedPour2;
    dom.icedIce.textContent = icedIce;

    // Update iced ratio label in current language (hide in Thai)
    dom.icedRatioLabel.textContent = currentLang === 'en' ? icedData.label : "";

    // Update dynamic text in recipe steps
    const t = translations[currentLang];
    dom.icedRecipeSteps[4].innerHTML = t.icedAddIce.replace("{iceAmount}", icedIce);
}

// Sync slider to number input
dom.slider.addEventListener('input', () => {
    const val = parseInt(dom.slider.value, 10);
    dom.valueInput.value = val;
    updateRecipe(val);
});

// Allow typing freely in the number box, only update if valid and don't clamp
dom.valueInput.addEventListener('input', () => {
    const val = parseInt(dom.valueInput.value, 10);
    if (!isNaN(val)) {
        // Sync slider (clamping its value) and update recipe with the raw typed value.
        // The input box itself is not clamped until the 'change' event.
        dom.slider.value = Math.max(10, Math.min(40, val));
        updateRecipe(val);
    }
});

// Clamp and sync on blur or enter
dom.valueInput.addEventListener('change', () => {
    let val = parseInt(dom.valueInput.value, 10);
    // If the input is blank or not a number, set to 10
    if (dom.valueInput.value === "" || isNaN(val)) val = 10;
    val = Math.max(10, Math.min(40, val));
    dom.valueInput.value = val;
    dom.slider.value = val;
    updateRecipe(val);
});

// Highlight all text when the grams input is focused
dom.valueInput.addEventListener('focus', function() {
    this.select();
});

// Ratio option click event
dom.ratioOptions.forEach(option => {
    option.addEventListener('click', () => {
        dom.ratioOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRatio = parseInt(option.getAttribute('data-ratio'), 10);
        updateRecipe(parseInt(dom.valueInput.value, 10));
        setLanguage(currentLang); // update iced ratio label
    });
});

// --- Language toggle logic ---

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Grams label
    dom.gramsLabelText.nodeValue = t.gramsLabel + " ";

    // Ratio text
    dom.ratioText.textContent = t.ratio;

    // Ratio options
    dom.ratioOptions[0].innerHTML = t.ratioTight;
    dom.ratioOptions[1].innerHTML = t.ratioNormal;
    dom.ratioOptions[2].innerHTML = t.ratioWide;

    // Recipe titles
    dom.recipeTitles[0].innerHTML = `<span class="fire-emoji">🔥</span>${t.hotRecipe}`;
    dom.recipeTitles[1].innerHTML = `<span class="ice-emoji">🧊</span>${t.icedRecipe}`;

    // Hot recipe steps
    dom.hotRecipeSteps[0].childNodes[0].nodeValue = t.bloom + " ";
    dom.hotRecipeSteps[0].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    dom.hotRecipeSteps[1].childNodes[0].nodeValue = t.pour + " ";
    dom.hotRecipeSteps[1].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;

    // Iced recipe steps
    dom.icedRecipeSteps[0].childNodes[0].nodeValue = t.icedBloom + " ";
    dom.icedRecipeSteps[0].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    dom.icedRecipeSteps[1].childNodes[0].nodeValue = t.icedPour1 + " ";
    dom.icedRecipeSteps[1].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    dom.icedRecipeSteps[2].childNodes[0].nodeValue = t.icedPour2 + " ";
    dom.icedRecipeSteps[2].querySelector('span').nextSibling.nodeValue = t.gramsSuffix;
    dom.icedRecipeSteps[3].textContent = t.icedSwirl;
    dom.icedRecipeSteps[4].innerHTML = t.icedAddIce.replace("{iceAmount}", dom.icedIce.textContent);
    dom.icedRecipeSteps[5].textContent = t.icedServe;

    // Infobox
    dom.infobox.innerHTML = `<span class="tip-emoji">✅</span>${t.grindFiner}`;

    // Iced ratio label (show in English, hide in Thai)
    const icedData = getIcedRatioData();
    dom.icedRatioLabel.textContent = lang === 'en' ? icedData.label : "";

    // Button text
    dom.langToggle.textContent = t.langBtn;
}

// Language toggle button
dom.langToggle.addEventListener('click', function() {
    setLanguage(currentLang === 'en' ? 'th' : 'en');
    updateRecipe(parseInt(dom.valueInput.value, 10));
});

// On load, set initial language
setLanguage('en');

// Initialize values
dom.slider.value = dom.valueInput.value;
updateRecipe(parseInt(dom.slider.value, 10));
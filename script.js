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
    { name: "Tight", ratio: 9, label: ["Tight (1:9)", "เข้ม (1:9)"] },
    { name: "Normal", ratio: 10, label: ["Normal (1:10)", "ปกติ (1:10)"] },
    { name: "Wide", ratio: 11, label: ["Wide (1:11)", "อ่อน (1:11)"] }
];

// Only Thai translations, English uses HTML defaults
const translationsTH = {
    gramsLabel: "กรัมของกาแฟ",
    ratio: "อัตราส่วน",
    ratioTight: "เข้ม<br>(1:14)",
    ratioNormal: "ปกติ<br>(1:16)",
    ratioWide: "อ่อน<br>(1:18)",
    hotRecipe: "สูตรร้อน",
    icedRecipe: "สูตรเย็น",
    bloom: "บลูมถึง",
    pour: "เทถึง",
    addIce: "เติมน้ำแข็ง",
    agitate: "- เขย่า",
    pourHeavy: "0:40 เทแรงถึง",
    pourTo: "1:10 เทถึง",
    stir: "- คน 3 ครั้ง",
    finish: "2:10 เสร็จสิ้น",
    grindFiner: "บดให้ละเอียดกว่าปกติ",
    icedRatioTight: "เข้ม (1:9)",
    icedRatioNormal: "ปกติ (1:10)",
    icedRatioWide: "อ่อน (1:11)",
    langBtn: "English",
    addIceSuffix: " กรัม น้ำแข็งลงแก้ว",
    gramsSuffix: " กรัม",
    stirText: "- คน 3 ครั้ง"
};

let currentLang = 'en';

function getSelectedRatio() {
    return selectedRatio;
}

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
    const icedRatio = iced.ratio;

    const ice = Math.round(grind * 4.375);
    const pour1 = Math.round(grind * 3);
    const pour2 = Math.round((grind * icedRatio) * 2 / 3);
    const pour3 = Math.round(grind * icedRatio);

    iceValue.textContent = ice;
    icedPour1.textContent = pour1;
    icedPour2.textContent = pour2;
    icedPour3.textContent = pour3;

    // Update iced ratio label in current language
    icedRatioLabel.textContent = iced.label[currentLang === 'en' ? 0 : 1];
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
    // If the input is blank, set to 10 and update everything
    if (valueInput.value === "") {
        valueInput.value = 10;
        slider.value = 10;
        updateRecipe(10);
        return;
    }
    if (!isNaN(val)) {
        updateRecipe(val);
    }
});

// Clamp and sync on blur or enter
valueInput.addEventListener('change', () => {
    let val = parseInt(valueInput.value, 10);
    // If the input is blank or not a number, set to 10
    if (valueInput.value === "" || isNaN(val)) val = 10;
    val = Math.max(10, Math.min(40, val));
    valueInput.value = val;
    slider.value = val;
    updateRecipe(val);
});

// Highlight all text when the grams input is focused
valueInput.addEventListener('focus', function() {
    this.select();
});

// Ratio option click event
ratioOptions.forEach(option => {
    option.addEventListener('click', () => {
        ratioOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedRatio = parseInt(option.getAttribute('data-ratio'), 10);
        updateRecipe(parseInt(valueInput.value, 10));
        setLanguage(currentLang); // update iced ratio label
    });
});

// --- Language toggle logic ---

function setLanguage(lang) {
    currentLang = lang;

    if (lang === 'th') {
        // Grams label
        document.querySelector('.grams-label').childNodes[0].nodeValue = translationsTH.gramsLabel + " ";

        // Ratio text
        document.querySelector('.ratio-text').textContent = translationsTH.ratio;

        // Ratio options
        const ratioOpts = document.querySelectorAll('.ratio-option');
        ratioOpts[0].innerHTML = translationsTH.ratioTight;
        ratioOpts[1].innerHTML = translationsTH.ratioNormal;
        ratioOpts[2].innerHTML = translationsTH.ratioWide;

        // Hot recipe title
        document.querySelectorAll('.recipe-title')[0].innerHTML = `<span class="fire-emoji">🔥</span>${translationsTH.hotRecipe}`;
        // Iced recipe title
        document.querySelectorAll('.recipe-title')[1].innerHTML = `<span class="ice-emoji">🧊</span>${translationsTH.icedRecipe}`;

        // Hot recipe steps
        const hotSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[0].children;
        hotSteps[0].childNodes[0].nodeValue = translationsTH.bloom + " ";
        hotSteps[0].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        hotSteps[1].childNodes[0].nodeValue = translationsTH.pour + " ";
        hotSteps[1].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;

        // Iced recipe steps
        const icedSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[1].children;
        icedSteps[0].childNodes[0].nodeValue = translationsTH.addIce + " ";
        icedSteps[0].querySelector('span').nextSibling.nodeValue = translationsTH.addIceSuffix;
        icedSteps[1].childNodes[0].nodeValue = translationsTH.bloom + " ";
        icedSteps[1].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[2].innerHTML = `<i>${translationsTH.agitate.replace('-', '')}</i>`;
        icedSteps[3].childNodes[0].nodeValue = translationsTH.pourHeavy + " ";
        icedSteps[3].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[4].childNodes[0].nodeValue = translationsTH.pourTo + " ";
        icedSteps[4].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[5].innerHTML = `<i>${translationsTH.stirText.replace('-', '')}</i>`;
        icedSteps[6].childNodes[0].nodeValue = translationsTH.finish;

        // Infobox
        document.querySelector('.infobox').innerHTML = `<span class="tip-emoji">✅</span>${translationsTH.grindFiner}`;

        // Iced ratio label
        const icedIdx = getIcedRatioIndex();
        const icedRatioLabels = [translationsTH.icedRatioTight, translationsTH.icedRatioNormal, translationsTH.icedRatioWide];
        icedRatioLabel.textContent = icedRatioLabels[icedIdx];

        // Button text
        document.getElementById('lang-toggle').textContent = translationsTH.langBtn;
    } else {
        // Restore English by resetting to the original HTML/defaults

        // Grams label
        document.querySelector('.grams-label').childNodes[0].nodeValue = "Grams of coffee ";

        // Ratio text
        document.querySelector('.ratio-text').textContent = "Ratio";

        // Ratio options
        const ratioOpts = document.querySelectorAll('.ratio-option');
        ratioOpts[0].innerHTML = "Tight<br>(1:14)";
        ratioOpts[1].innerHTML = "Normal<br>(1:16)";
        ratioOpts[2].innerHTML = "Wide<br>(1:18)";

        // Hot recipe title
        document.querySelectorAll('.recipe-title')[0].innerHTML = `<span class="fire-emoji">🔥</span>Hot Recipe`;
        // Iced recipe title
        document.querySelectorAll('.recipe-title')[1].innerHTML = `<span class="ice-emoji">🧊</span>Iced Recipe`;

        // Hot recipe steps
        const hotSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[0].children;
        hotSteps[0].childNodes[0].nodeValue = "Bloom to ";
        hotSteps[0].querySelector('span').nextSibling.nodeValue = " g";
        hotSteps[1].childNodes[0].nodeValue = "Pour to ";
        hotSteps[1].querySelector('span').nextSibling.nodeValue = " g";

        // Iced recipe steps
        const icedSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[1].children;
        icedSteps[0].childNodes[0].nodeValue = "Add ";
        icedSteps[0].querySelector('span').nextSibling.nodeValue = " g ice to glass";
        icedSteps[1].childNodes[0].nodeValue = "Bloom to ";
        icedSteps[1].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[2].innerHTML = "<i>Agitate</i>";
        icedSteps[3].childNodes[0].nodeValue = "0:40 Pour heavy to ";
        icedSteps[3].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[4].childNodes[0].nodeValue = "1:10 Pour to ";
        icedSteps[4].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[5].innerHTML = "<i>Stir 3 times</i>";
        icedSteps[6].childNodes[0].nodeValue = "2:10 Finish";

        // Infobox
        document.querySelector('.infobox').innerHTML = `<span class="tip-emoji">✅</span>Grind finer than usual`;

        // Iced ratio label
        const icedIdx = getIcedRatioIndex();
        const icedRatioLabels = ["Tight (1:9)", "Normal (1:10)", "Wide (1:11)"];
        icedRatioLabel.textContent = icedRatioLabels[icedIdx];

        // Button text
        document.getElementById('lang-toggle').textContent = "ภาษาไทย";
    }
}

// Language toggle button
document.getElementById('lang-toggle').addEventListener('click', function() {
    setLanguage(currentLang === 'en' ? 'th' : 'en');
    updateRecipe(parseInt(valueInput.value, 10));
});

// On ratio change, update iced ratio label in correct language
ratioOptions.forEach(option => {
    option.addEventListener('click', () => {
        setLanguage(currentLang);
    });
});

// On load, set initial language
setLanguage('en');

// Initialize values
slider.value = valueInput.value;
updateRecipe(parseInt(slider.value, 10));
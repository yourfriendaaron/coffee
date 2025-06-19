const slider = document.getElementById('coffee-slider');
const valueInput = document.getElementById('coffee-value');
const bloomValue = document.getElementById('bloom-value');
const pourValue = document.getElementById('pour-value');

// Ratio selector logic
const ratioOptions = Array.from(document.querySelectorAll('.ratio-option'));
let selectedRatio = 16; // default (matches .selected in HTML)

// Iced recipe elements
const icedRatioLabel = document.getElementById('iced-ratio-label');

// Iced ratios mapping (tight: 1-11, normal: 1-12, wide: 1-13)
const icedRatios = [
    { name: "Tight", ratio: 11, label: ["Tight (1:11)", ""] },
    { name: "Normal", ratio: 12, label: ["Normal (1:12)", ""] },
    { name: "Wide", ratio: 13, label: ["Wide (1:13)", ""] }
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
    grindFiner: "บดให้ละเอียดกว่าปกติ",
    langBtn: "English",
    icedBloom: "บลูมถึง",
    icedPour1: "1:00 เทถึง",
    icedPour2: "1:45 เทถึง",
    icedSwirl: "เขย่าเล็กน้อยให้หน้ากาแฟเรียบ ปล่อยให้น้ำไหลจนหมด",
    icedAddIce: "เติมน้ำแข็ง <span id='iced-ice'>60</span> กรัม ลงในคาราฟ คนจนเย็น",
    icedServe: "เสิร์ฟใส่น้ำแข็ง",
    gramsSuffix: " กรัม"
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

    // Iced recipe calculations (new logic)
    const icedIdx = getIcedRatioIndex();
    const iced = icedRatios[icedIdx];
    const icedRatio = iced.ratio;

    const icedBloom = Math.round(grind * 3);
    const icedPour1 = Math.round(grind * icedRatio * 0.625);
    const icedPour2 = Math.round(grind * icedRatio);
    const icedIce = Math.round(grind * icedRatio * 0.25);

    document.getElementById('iced-bloom').textContent = icedBloom;
    document.getElementById('iced-pour1').textContent = icedPour1;
    document.getElementById('iced-pour2').textContent = icedPour2;
    document.getElementById('iced-ice').textContent = icedIce;

    // Update iced ratio label in current language (hide in Thai)
    icedRatioLabel.textContent = currentLang === 'en' ? iced.label[0] : "";
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

        // Ratio options (show only 1:14, 1:16, 1:18 in Thai)
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

        // Iced recipe steps (new, 6 steps)
        const icedSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[1].children;
        icedSteps[0].childNodes[0].nodeValue = translationsTH.icedBloom + " ";
        icedSteps[0].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[1].childNodes[0].nodeValue = translationsTH.icedPour1 + " ";
        icedSteps[1].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[2].childNodes[0].nodeValue = translationsTH.icedPour2 + " ";
        icedSteps[2].querySelector('span').nextSibling.nodeValue = translationsTH.gramsSuffix;
        icedSteps[3].textContent = translationsTH.icedSwirl;
        icedSteps[4].innerHTML = translationsTH.icedAddIce.replace("60", document.getElementById('iced-ice').textContent);
        icedSteps[5].textContent = translationsTH.icedServe;

        // Infobox
        document.querySelector('.infobox').innerHTML = `<span class="tip-emoji">✅</span>${translationsTH.grindFiner}`;

        // Iced ratio label (hide in Thai)
        icedRatioLabel.textContent = "";

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

        // Iced recipe steps (new, 6 steps)
        const icedSteps = document.querySelectorAll('.recipe-container ul.recipe-steps')[1].children;
        icedSteps[0].childNodes[0].nodeValue = "Bloom to ";
        icedSteps[0].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[1].childNodes[0].nodeValue = "1:00 Pour to ";
        icedSteps[1].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[2].childNodes[0].nodeValue = "1:45 Pour to ";
        icedSteps[2].querySelector('span').nextSibling.nodeValue = " g";
        icedSteps[3].textContent = "Swirl to flatten the bed and let it drain completely.";
        icedSteps[4].innerHTML = "Add <span id='iced-ice'>" + document.getElementById('iced-ice').textContent + "</span> g ice to carafe, stir until cooled.";
        icedSteps[5].textContent = "Serve over ice.";

        // Infobox
        document.querySelector('.infobox').innerHTML = `<span class="tip-emoji">✅</span>Grind finer than usual`;

        // Iced ratio label (show in English)
        const icedIdx = getIcedRatioIndex();
        const icedRatioLabels = ["Tight (1:11)", "Normal (1:12)", "Wide (1:13)"];
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
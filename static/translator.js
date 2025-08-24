const html = document.documentElement;
const themeButtons = document.querySelectorAll('[data-theme]');

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');

    if(theme === 'auto') {
      html.removeAttribute('data-bs-theme'); // fallback to system preference
    } else {
      html.setAttribute('data-bs-theme', theme);
    }
  });
});
// Grab all elements
const sourceText = document.querySelector(".translator-source-text");
const targetText = document.querySelector(".translator-target-text");
const fromLangSelect = document.querySelector(".translator-from-lang");
const toLangSelect = document.querySelector(".translator-to-lang");
const translateBtn = document.querySelector(".translator-translate-btn");
const clearSourceBtn = document.querySelector(".translator-clear-source");
const copyBtn = document.querySelectorAll(".translator-copy-btn");
const swapBtn = document.querySelector(".translator-swap-btn");
const charCount = document.querySelector(".translator-char-count");
const sampleBtns = document.querySelectorAll(".translator-sample-btn");
const autoDetectCheckbox = document.querySelector(".translator-auto-detect");
const instantTranslateCheckbox = document.querySelector(".translator-instant-translate");

// Function to update character count
const updateCharCount = () => {
    charCount.innerText = `${sourceText.value.length} characters`;
};

// Swap languages
swapBtn.addEventListener("click", () => {
    const temp = fromLangSelect.value;
    fromLangSelect.value = toLangSelect.value;
    toLangSelect.value = temp;
});

// Clear source text
clearSourceBtn.addEventListener("click", () => {
    sourceText.value = "";
    updateCharCount();
});

// Copy target text
copyBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        targetText.select();
        navigator.clipboard.writeText(targetText.value)
            .then(() => alert("Copied to clipboard!"))
            .catch(err => console.error(err));
    });
});

// Insert sample text into source
sampleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        sourceText.value = btn.dataset.text;
        updateCharCount();
        if (instantTranslateCheckbox.checked) {
            translateText();
        }
    });
});

// Translate function
const translateText = async () => {
    const textToTranslate = sourceText.value.trim();
    if (!textToTranslate) {
        targetText.value = "";
        return;
    }

    const payload = {
        text: textToTranslate,
        from: autoDetectCheckbox.checked ? "auto" : fromLangSelect.value,
        to: toLangSelect.value
    };

    targetText.value = "Translating...";

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        targetText.value = data.translated_text || "Translation failed!";
    } catch (error) {
        console.error(error);
        targetText.value = "Error connecting to server!";
    }
};

// Translate button click
translateBtn.addEventListener("click", translateText);

// Instant translate as you type
sourceText.addEventListener("input", () => {
    updateCharCount();
    if (instantTranslateCheckbox.checked) {
        translateText();
    }
});



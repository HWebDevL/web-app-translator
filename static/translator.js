// ---------- THEME TOGGLE ----------
const html = document.documentElement;
const themeButtons = document.querySelectorAll('[data-theme]');

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');
    if (theme === 'auto') {
      html.removeAttribute('data-bs-theme'); 
    } else {
      html.setAttribute('data-bs-theme', theme);
    }
  });
});

// ---------- ELEMENTS ----------
const sourceText = document.querySelector(".translator-source-text");
const targetText = document.querySelector(".translator-target-text");
const fromSelect = document.querySelector(".translator-from-lang");
const toSelect = document.querySelector(".translator-to-lang");
const translateBtn = document.querySelector(".translator-translate-btn");
const clearBtn = document.querySelector(".translator-clear-source");
const copyBtns = document.querySelectorAll(".translator-copy-btn");
const swapBtn = document.querySelector(".translator-swap-btn");
const charCount = document.querySelector(".translator-char-count");
const sampleBtns = document.querySelectorAll(".translator-sample-btn");
const autoDetectCheckbox = document.querySelector(".translator-auto-detect");
const instantTranslateCheckbox = document.querySelector(".translator-instant-translate");

// ---------- CHARACTER COUNT ----------
const updateCharCount = () => {
  charCount.innerText = `${sourceText.value.length} characters`;
};

// ---------- SWAP LANGUAGES ----------
swapBtn.addEventListener("click", () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
});

// ---------- CLEAR SOURCE ----------
clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  updateCharCount();
  targetText.value = "";
});

// ---------- COPY TO CLIPBOARD ----------
copyBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    targetText.select();
    navigator.clipboard.writeText(targetText.value)
      .then(() => alert("Copied to clipboard!"))
      .catch(err => console.error(err));
  });
});

// ---------- SAMPLE TEXTS ----------
sampleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    sourceText.value = btn.dataset.text;
    updateCharCount();
    if (instantTranslateCheckbox.checked) translateText();
  });
});

// ---------- AUTO-DETECT SYNC ----------
autoDetectCheckbox.addEventListener("change", () => {
  if (autoDetectCheckbox.checked) {
    fromSelect.value = "auto";
  } else {
    if (fromSelect.value === "auto") fromSelect.selectedIndex = 1;
  }
});

fromSelect.addEventListener("change", () => {
  if (fromSelect.value !== "auto") {
    autoDetectCheckbox.checked = false;
  } else {
    autoDetectCheckbox.checked = true;
  }
});

// ---------- TRANSLATE FUNCTION ----------
const translateText = async () => {
  const textToTranslate = sourceText.value.trim();
  if (!textToTranslate) {
    targetText.value = "";
    return;
  }

  // Show detecting if auto
  if (autoDetectCheckbox.checked) {
    fromSelect.querySelector('option[value="auto"]').textContent = "Detecting language...";
  }

  const payload = {
    text: textToTranslate,
    from: autoDetectCheckbox.checked ? "auto" : fromSelect.value,
    to: toSelect.value
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
  } catch (err) {
    console.error(err);
    targetText.value = "Error connecting to server!";
  } finally {
    // Reset auto-detect option text
    if (autoDetectCheckbox.checked) {
      fromSelect.querySelector('option[value="auto"]').textContent = "Detect language";
    }
  }
};

// ---------- BUTTON & INSTANT TRANSLATE ----------
translateBtn.addEventListener("click", translateText);

sourceText.addEventListener("input", () => {
  updateCharCount();
  if (instantTranslateCheckbox.checked) translateText();
});

// ---------- INIT ----------
updateCharCount();


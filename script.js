// ===== DOM elements =====
const shapeSelect = document.getElementById("shapeSelect");
const styleNameInput = document.getElementById("styleName");
const baseColorInput = document.getElementById("baseColor");
const accentColorInput = document.getElementById("accentColor");
const styleSelect = document.getElementById("styleSelect");
const accentCheckboxes = document.querySelectorAll(".accent-checkbox");

const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const saveBtn = document.getElementById("saveBtn");

const previewContainer = document.getElementById("previewContainer");
const descriptionP = document.getElementById("designDescription");
const savedContainer = document.getElementById("savedContainer");

// ===== Data =====
const shapes = ["square", "coffin", "almond", "stiletto", "duck"];
const artStyles = ["solid", "glitter", "gradient", "stripes", "dots", "french"];
const presetColors = [
  //  Pinks
  "#ffb6d9", "#ff80b3", "#ff4fa3", "#ff1a75", "#e60073",
  "#ffcce6", "#ff99cc", "#ff66b3", "#ff3385", "#cc0052",

  //  Reds
  "#ff6666", "#ff4d4d", "#ff1a1a", "#e60000", "#b30000",
  "#ff9999", "#ffcccc", "#cc6666", "#990000", "#660000",

  //  Oranges
  "#ffb84d", "#ffa64d", "#ff9933", "#ff8000", "#ff6600",
  "#ffd6b3", "#ffcc99", "#ffb380", "#e67300", "#cc5200",

  //  Yellows
  "#fff099", "#ffe066", "#ffd633", "#ffcc00", "#e6b800",
  "#fff7cc", "#ffee99", "#ffe680", "#e6ac00", "#b38600",

  //  Greens
  "#b3ffcc", "#80ffaa", "#33ff77", "#00e65c", "#00b347",
  "#ccffe6", "#99ffcc", "#66ffb3", "#33cc99", "#009966",

  //  Blues
  "#cce6ff", "#99ccff", "#66b3ff", "#3385ff", "#0066ff",
  "#9ad0f5", "#4da6ff", "#1a75ff", "#0052cc", "#003380",

  //  Purples
  "#e5ccff", "#d1a3ff", "#c9a4ff", "#b266ff", "#9933ff",
  "#eeccff", "#dd99ff", "#cc66ff", "#b800e6", "#730099",

  //  Pastels
  "#ffd6e7", "#ffe6f7", "#dff7ff", "#e4ffe6", "#f9ffd6",
  "#e8f3ff", "#ffdfe2", "#fef3ff", "#ecffe8", "#fffde8",

  //  Neons
  "#ff4dff", "#ff00ff", "#ff0099", "#00ffcc", "#00ffff",
  "#39ff14", "#ccff00", "#ffea00", "#ff5e00", "#ff0a0a",

  //  Neutrals
  "#f2f2f2", "#e6e6e6", "#cccccc", "#999999", "#666666",
  "#ffffff", "#fafafa", "#eeeeee", "#dddddd", "#bbbbbb",

  //  Darks + Rich Tones
  "#330033", "#220022", "#110011", "#000033", "#000066",
  "#0d001a", "#1a0033", "#33001a", "#330000", "#1a0000",

  //  Jewel Tones
  "#6a0dad", "#9b4dca", "#0047ab", "#007f5f", "#0096c7",
  "#ff006e", "#8338ec", "#6930c3", "#240046", "#5a189a",

  //  Soft Muted / Aesthetic
  "#d4a5a5", "#ceb1be", "#a7bed3", "#c6e2e9", "#f2ddde",
  "#e8c1c5", "#d2b2b2", "#b392ac", "#cab1d1", "#f7e2e2"
];

// Load saved designs from localStorage
let savedDesigns = [];
try {
  const stored = localStorage.getItem("savedDesigns");
  if (stored) savedDesigns = JSON.parse(stored);
} catch (e) {
  savedDesigns = [];
}


// ===== BUILD DESIGN OBJECT =====
function getCurrentDesign() {
  const accentFingers = [];
  accentCheckboxes.forEach((box) => {
    if (box.checked) accentFingers.push(box.value);
  });

  return {
    shape: shapeSelect.value,
    style: styleSelect.value,
    baseColor: baseColorInput.value,
    accentColor: accentColorInput.value,
    accentFingers,
    styleName: styleNameInput.value
  };
}


// ===== DESCRIPTION TEXT =====
function buildDescription(design) {
  let text = `Shape: ${design.shape}, Style: ${design.style}, Base color: ${design.baseColor}.`;

  if (design.accentFingers.length > 0) {
    const pretty = design.accentFingers
      .map(f => f.charAt(0).toUpperCase() + f.slice(1))
      .join(", ");

    text += ` Accent nails: ${pretty} (color ${design.accentColor}).`;
  } else {
    text += " No accent nails selected.";
  }

  if (design.styleName && design.styleName.trim() !== "")
    text += ` Style name: "${design.styleName.trim()}".`;

  return text;
}



// ===== APPLY DESIGN TO A HAND =====
function applyDesignToHand(handElement, design) {
  const nails = handElement.querySelectorAll(".nail");

  nails.forEach((nail) => {
    nail.className = "nail"; 
    nail.style.backgroundImage = "";
    nail.style.removeProperty("--tip-color");

    // shape + pattern
    nail.classList.add(`shape-${design.shape}`);
    nail.classList.add(`pattern-${design.style}`);

    const isAccent = design.accentFingers.includes(nail.dataset.finger);

    if (design.style === "french") {
      nail.style.backgroundColor = design.baseColor;
      nail.style.setProperty("--tip-color", design.accentColor);

      if (isAccent) nail.classList.add("accent");

    } else {
      // Other patterns
      nail.style.backgroundColor = isAccent
        ? design.accentColor
        : design.baseColor;

      if (isAccent) nail.classList.add("accent");
    }

    nail.addEventListener("click", () => {
      nail.classList.toggle("clicked");
    });
  });
}



// ===== BUILD A HAND ELEMENT =====
function createHandElement(labelText, design) {
  const wrapper = document.createElement("div");
  wrapper.className = "hand-wrapper";

  const label = document.createElement("p");
  label.className = "hand-label";
  label.textContent = labelText;
  wrapper.appendChild(label);

  const hand = document.createElement("div");
  hand.className = "hand";

  // Hand outline image
  const img = document.createElement("img");
  img.src = "hand-outline.png";
  img.alt = "Hand outline";
  img.className = "hand-image";
  hand.appendChild(img);

  // Nails
  const fingerNames = ["pinky", "ring", "middle", "index", "thumb"];
  fingerNames.forEach(name => {
    const nail = document.createElement("div");
    nail.className = "nail";
    nail.dataset.finger = name;
    hand.appendChild(nail);
  });

  wrapper.appendChild(hand);

  applyDesignToHand(hand, design);
  return wrapper;
}

// ===== GENERATE PREVIEW =====
function generateNailSets() {
  const design = getCurrentDesign();

  previewContainer.innerHTML = "";

  const handElement = createHandElement("Your Design Preview", design);
  previewContainer.appendChild(handElement);

  descriptionP.textContent = buildDescription(design);
}

// ===== RANDOM DESIGN =====
function randomDesign() {
  shapeSelect.value = shapes[Math.floor(Math.random() * shapes.length)];
  styleSelect.value = artStyles[Math.floor(Math.random() * artStyles.length)];
  baseColorInput.value = presetColors[Math.floor(Math.random() * presetColors.length)];
  accentColorInput.value = presetColors[Math.floor(Math.random() * presetColors.length)];

  accentCheckboxes.forEach(box => box.checked = Math.random() > 0.5);

  styleNameInput.value = "Random Set";
  generateNailSets();
}

// ===== LOAD DESIGN INTO CONTROLS =====
function loadDesignIntoControls(design) {
  shapeSelect.value = design.shape;
  styleSelect.value = design.style;
  baseColorInput.value = design.baseColor;
  accentColorInput.value = design.accentColor;

  accentCheckboxes.forEach(box => {
    box.checked = design.accentFingers.includes(box.value);
  });

  styleNameInput.value = design.styleName || "";
}

// ===== DELETE A SAVED DESIGN =====
function deleteSavedDesign(index) {
  savedDesigns.splice(index, 1);

  try {
    localStorage.setItem("savedDesigns", JSON.stringify(savedDesigns));
  } catch (e) {}

  renderSavedDesigns();
}

// ===== RENDER SAVED DESIGNS =====
function renderSavedDesigns() {
  savedContainer.innerHTML = "";

  if (savedDesigns.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No designs saved yet.";
    empty.style.fontSize = "0.85rem";
    empty.style.color = "#777";
    savedContainer.appendChild(empty);
    return;
  }

  savedDesigns.forEach((design, index) => {
    const card = document.createElement("div");
    card.className = "saved-card";

    // header row
    const header = document.createElement("div");
    header.className = "saved-card-header";

    const title = document.createElement("div");
    title.className = "saved-card-title";
    title.textContent =
      design.styleName?.trim() !== ""
        ? design.styleName
        : `Design ${index + 1}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "saved-card-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSavedDesign(index);
    });

    header.appendChild(title);
    header.appendChild(deleteBtn);
    card.appendChild(header);

    const meta = document.createElement("div");
    meta.className = "saved-card-meta";
    meta.textContent = `${design.shape} • ${design.style}`;
    card.appendChild(meta);

    const colors = document.createElement("small");
    colors.textContent = `Base: ${design.baseColor} | Accent: ${design.accentColor}`;
    card.appendChild(colors);

    card.addEventListener("click", () => {
      loadDesignIntoControls(design);
      generateNailSets();
    });

    savedContainer.appendChild(card);
  });
}

// ===== SAVE CURRENT DESIGN =====
function saveCurrentDesign() {
  const design = getCurrentDesign();
  savedDesigns.push(design);

  try {
    localStorage.setItem("savedDesigns", JSON.stringify(savedDesigns));
  } catch (e) {}

  renderSavedDesigns();
}

// ===== Event Listeners =====
generateBtn.addEventListener("click", generateNailSets);
randomBtn.addEventListener("click", randomDesign);
saveBtn.addEventListener("click", saveCurrentDesign);

// Initial load
generateNailSets();
renderSavedDesigns();

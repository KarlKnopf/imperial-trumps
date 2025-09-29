const backImg = "images/back/card78.png";
let deck = [];

// ---- Build deck ----
function buildDeck() {
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) {
        deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png` });
    }
    // Keys 22-35
    for (let i = 22; i <= 35; i++) {
        deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    }
    // Cups 36-49
    for (let i = 36; i <= 49; i++) {
        deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    }
    // Swords 50-63
    for (let i = 50; i <= 63; i++) {
        deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    }
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) {
        deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png` });
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- Initialize Game ----
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ---- Stock stack array ----
let stockStack = [...deck]; // copy of shuffled deck

// ---- Tableau and Foundations ----
let tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative"; // necessary for fanning
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

// ---- Create card element ----
function createCardElement(cardData, faceUp = false) {
    const img = document.createElement("img");
    img.src = faceUp ? cardData.img : backImg;
    img.dataset.type = cardData.type;
    img.dataset.rank = cardData.rank;
    img.dataset.front = cardData.img;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    img.addEventListener("click", () => {
        if (img.src.includes(backImg)) img.src = img.dataset.front;
    });

    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: img.dataset.type,
            rank: img.dataset.rank,
            src: img.dataset.front
        }));
    });

    return img;
}

// ---- Render Stock ----
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;
    const topCard = stockStack[stockStack.length - 1];
    const cardEl = createCardElement(topCard);
    cardEl.addEventListener("click", () => {
        cardEl.src = cardEl.dataset.front;
    });
    stockDiv.appendChild(cardEl);
}

// ---- Tableau Fanning ----
function updateFan(pile) {
    const cards = Array.from(pile.children);
    cards.forEach((card, idx) => {
        card.style.position = "absolute";
        card.style.top = `${30 * idx}px`;
        card.style.left = "0px";
    });
}

// ---- Remove Card from anywhere ----
function removeCardFromAllPiles(cardData) {
    // Stock
    stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
    // Tableau
    tableauPiles.forEach(pile => {
        Array.from(pile.children).forEach(c => {
            if (c.dataset.type === cardData.type && c.dataset.rank == cardData.rank) pile.removeChild(c);
        });
    });
    // Foundations
    Array.from(foundationsDiv.children).forEach(f => {
        Array.from(f.children).forEach(c => {
            if (c.dataset.type === cardData.type && c.dataset.rank == cardData.rank) f.removeChild(c);
        });
    });
}

// ---- Enable Drop with Rule Checking ----
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const cardEl = createCardElement(cardData, true);

        // Check rules for foundations
        if (targetDiv.classList.contains("foundation")) {
            const top = targetDiv.lastElementChild;
            if (!checkFoundationRules(cardData, top)) return;
        }

        removeCardFromAllPiles(cardData);
        targetDiv.appendChild(cardEl);

        if (targetDiv.classList.contains("tableau-pile")) updateFan(targetDiv);
        renderStock();
    });
}

// ---- Simple Foundation Rule Checker ----
function checkFoundationRules(card, topCard) {
    if (!topCard) return true; // empty foundation
    if (card.type === "major") {
        return card.rank === parseInt(topCard.dataset.rank) + 1;
    } else {
        return card.type === topCard.dataset.type && card.rank === parseInt(topCard.dataset.rank) + 1;
    }
}

// ---- Enable Drop on all piles ----
tableauPiles.forEach(pile => enableDrop(pile));
Array.from(foundationsDiv.children).forEach(f => enableDrop(f));

// ---- Deal initial tableau ----
for (let i = 0; i < tableauPiles.length; i++) {
    for (let j = 0; j <= i; j++) {
        const cardData = stockStack.pop();
        const faceUp = j === i; // only bottom card face up
        tableauPiles[i].appendChild(createCardElement(cardData, faceUp));
    }
    updateFan(tableauPiles[i]);
}

// ---- Start game ----
renderStock();

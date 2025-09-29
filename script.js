// ----------------------
// CONFIG
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

// ----------------------
// BUILD DECK
// ----------------------
function buildDeck() {
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png` });
    // Keys 22-35
    for (let i = 22; i <= 35; i++) deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    // Cups 36-49
    for (let i = 36; i <= 49; i++) deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    // Swords 50-63
    for (let i = 50; i <= 63; i++) deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png` });
}

// ----------------------
// SHUFFLE
// ----------------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------
// DOM ELEMENTS
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// INITIALIZE GAME
// ----------------------
buildDeck();
deck = shuffle(deck);
let stockStack = [...deck]; // copy shuffled deck

// ----------------------
// HELPER: CREATE CARD ELEMENT
// ----------------------
function createCard(cardData, faceUp = false) {
    const img = document.createElement("img");
    img.src = faceUp ? cardData.img : backImg;
    img.dataset.front = cardData.img;
    img.dataset.type = cardData.type;
    img.dataset.rank = cardData.rank;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    // Flip on click
    img.addEventListener("click", () => {
        img.src = img.src === backImg ? img.dataset.front : backImg;
    });

    // Drag behavior
    addDragBehavior(img);

    return img;
}

// ----------------------
// ADD DRAG BEHAVIOR
// ----------------------
function addDragBehavior(card) {
    card.addEventListener("dragstart", () => card.classList.add("dragging"));
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
}

// ----------------------
// RENDER STOCK
// ----------------------
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length - 1];
    const cardEl = createCard(topCard, false);

    cardEl.addEventListener("click", () => {
        cardEl.src = cardEl.src === backImg ? cardEl.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });

    stockDiv.appendChild(cardEl);
}

// ----------------------
// CREATE TABLEAU
// ----------------------
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.dataset.index = i;
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);

    enableDrop(pile);
}

// ----------------------
// DEAL TABLEAU
// ----------------------
function dealTableau() {
    let deckIndex = 0;
    for (let i = 0; i < tableauPiles.length; i++) {
        for (let j = 0; j <= i; j++) {
            const faceUp = j === i; // bottom card face-up
            const cardEl = createCard(stockStack[deckIndex], faceUp);
            tableauPiles[i].appendChild(cardEl);
            deckIndex++;
        }
    }
    stockStack = stockStack.slice(deckIndex);
    renderStock();
}

// ----------------------
// CREATE FOUNDATIONS
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ----------------------
// ENABLE DROP FUNCTION
// ----------------------
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", e => e.preventDefault());
    targetDiv.addEventListener("drop", e => {
        e.preventDefault();
        const cardEl = document.querySelector(".dragging");
        if (!cardEl) return;

        // Optional: add foundation rules here

        targetDiv.appendChild(cardEl);
        if (targetDiv.classList.contains("tableau-pile")) updateFan(targetDiv);
    });
}

// ----------------------
// UPDATE FAN IN TABLEAU
// ----------------------
function updateFan(pile) {
    const cards = pile.querySelectorAll("img");
    cards.forEach((c, idx) => {
        c.style.top = `${idx * 30}px`;
        c.style.left = "0px";
        c.style.position = "absolute";
    });
}

// ----------------------
// INITIALIZE
// ----------------------
dealTableau();

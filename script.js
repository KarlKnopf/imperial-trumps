// ----------------------
// Setup deck
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------
// DOM references
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// Build deck & shuffle
// ----------------------
buildDeck();
deck = shuffle(deck);
let stockStack = [...deck];

// ----------------------
// Render stock
// ----------------------
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.src = backImg;
    img.dataset.front = topCard.img;
    img.dataset.type = topCard.type;
    img.dataset.rank = topCard.rank;
    img.classList.add("card");
    img.setAttribute("draggable", true);

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
}
renderStock();

// ----------------------
// Build tableau
// ----------------------
const tableauPiles = [];

for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// Deal cards to tableau (fan)
tableauPiles.forEach((pile, index) => {
    for (let j = 0; j <= index; j++) {
        const cardData = stockStack.pop();
        const img = document.createElement("img");
        img.src = cardData.img;
        img.dataset.type = cardData.type;
        img.dataset.rank = cardData.rank;
        img.classList.add("card");
        img.style.top = `${j * 30}px`;
        pile.appendChild(img);
        img.setAttribute("draggable", true);
        addDragBehavior(img);
    }
});

// ----------------------
// Build foundations
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
// Drag & Drop
// ----------------------
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
    });
}

function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if affected
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ----------------------
// Fan cards inside tableau pile
// ----------------------
function fanTableauPile(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.top = `${index * 30}px`;
    });
}
tableauPiles.forEach(p => enableDrop(p));

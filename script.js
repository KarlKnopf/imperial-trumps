// ----------------------
// SETUP
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

// ---- Build deck ----
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
let stockStack = [...deck]; // copy of shuffled deck

// ----------------------
// DRAG AND DROP HELPERS
// ----------------------
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", ""); // required for drag
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
}

function enableDrop(targetDiv, callback) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        // Remember the old pile (parent before drop)
        const oldPile = dragging.parentElement;

        // Move the card into the new pile
        targetDiv.appendChild(dragging);

        // Re-fan the new pile
        if (targetDiv.classList.contains("tableau-pile")) {
            fanTableauPile(targetDiv);
        }

        // Re-fan the old pile to close the gap
        if (oldPile && oldPile.classList.contains("tableau-pile")) {
            fanTableauPile(oldPile);
        }

        callback?.(dragging);
    });
}

// ----------------------
// STOCK
// ----------------------
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCardData = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.src = backImg;
    img.dataset.front = topCardData.img;
    img.dataset.type = topCardData.type;
    img.dataset.rank = topCardData.rank;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    addDragBehavior(img);

    img.addEventListener("click", () => {
        img.src = img.src === backImg ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
}

renderStock();

// ----------------------
// TABLEAU
// ----------------------
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative";
    pile.innerHTML = `<strong>Pile ${i + 1}</strong>`;
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);

    enableDrop(pile, (card) => fanTableauPile(pile));
}

// Deal initial tableau
for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
        const cardData = stockStack.pop();
        const img = document.createElement("img");
        img.src = backImg;
        img.dataset.front = cardData.img;
        img.dataset.type = cardData.type;
        img.dataset.rank = cardData.rank;
        img.classList.add("card");
        img.setAttribute("draggable", "true");

        addDragBehavior(img);

        // Last card in pile face up
        if (j === i) img.src = cardData.img;

        tableauPiles[i].appendChild(img);
    }
    fanTableauPile(tableauPiles[i]);
}

// Fan cards vertically
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((card, idx) => {
        card.style.position = "absolute";
        card.style.top = `${30 * idx}px`; // adjust spacing
        card.style.left = "0px";
    });
}

// ----------------------
// FOUNDATIONS
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach((suit) => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.style.position = "relative";
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);

    enableDrop(f); // allow cards to be dropped
});

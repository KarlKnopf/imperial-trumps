// ----------------------
// Deck setup
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

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

// ----------------------
// DOM references
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// Initialize deck and stock
// ----------------------
buildDeck();
deck = shuffle(deck);
let stockStack = [...deck];

// ----------------------
// Helpers
// ----------------------
function createCardElement(card, faceUp = false) {
    const img = document.createElement("img");
    img.src = faceUp ? card.img : backImg;
    img.dataset.front = card.img;
    img.dataset.type = card.type;
    img.dataset.rank = card.rank;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    // Drag events
    img.addEventListener("dragstart", (e) => {
        img.classList.add("dragging");
    });
    img.addEventListener("dragend", (e) => {
        img.classList.remove("dragging");
    });

    // Click to flip
    img.addEventListener("click", () => {
        img.src = img.src === backImg ? img.dataset.front : backImg;
    });

    return img;
}

function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((c, i) => {
        c.style.position = "absolute";
        c.style.top = `${i * 30}px`;
        c.style.left = `0px`;
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

        // Re-fan tableau if needed
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ----------------------
// Create tableau piles
// ----------------------
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative";
    pile.style.display = "inline-block";
    pile.style.width = "120px";
    pile.style.height = "400px";
    pile.style.marginRight = "10px";
    tableauDiv.appendChild(pile);
    enableDrop(pile);
    tableauPiles.push(pile);
}

// ----------------------
// Deal tableau
// ----------------------
function dealTableau() {
    for (let i = 0; i < tableauPiles.length; i++) {
        for (let j = 0; j <= i; j++) {
            const card = stockStack.shift();
            if (!card) continue;
            const faceUp = j === i;
            const cardEl = createCardElement(card, faceUp);
            tableauPiles[i].appendChild(cardEl);
        }
        fanTableauPile(tableauPiles[i]);
    }
}

// ----------------------
// Create foundations
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.style.display = "inline-block";
    f.style.width = "120px";
    f.style.height = "180px";
    f.style.marginRight = "10px";
    f.style.border = "2px dashed black";
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ----------------------
// Render stock
// ----------------------
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;
    const topCard = stockStack[stockStack.length - 1];
    const img = createCardElement(topCard, false);
    img.addEventListener("click", () => {
        // Draw to first tableau pile as an example
        const firstPile = tableauPiles[0];
        firstPile.appendChild(createCardElement(stockStack.pop(), true));
        fanTableauPile(firstPile);
        renderStock();
    });
    stockDiv.appendChild(img);
}

// ----------------------
// Start game
// ----------------------
dealTableau();
renderStock();

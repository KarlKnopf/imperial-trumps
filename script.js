// ---- CARD DEFINITIONS ----
const backImg = "images/back/card78.png";
let deck = [];

// Build deck
function buildDeck() {
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) {
        deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png`, id: `major-${i}` });
    }
    // Keys 22-35
    for (let i = 22; i <= 35; i++) {
        deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png`, id: `keys-${i-21}` });
    }
    // Cups 36-49
    for (let i = 36; i <= 49; i++) {
        deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png`, id: `cups-${i-35}` });
    }
    // Swords 50-63
    for (let i = 50; i <= 63; i++) {
        deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png`, id: `swords-${i-49}` });
    }
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) {
        deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png`, id: `pentacles-${i-63}` });
    }
}

// Shuffle deck
function shuffle(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- INIT ----
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

let stockStack = [...deck]; // copy for stock

// ---- CREATE STOCK ----
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length-1];
    const img = document.createElement("img");
    img.src = backImg;
    img.dataset.front = topCard.img;
    img.dataset.id = topCard.id;
    img.dataset.type = topCard.type;
    img.dataset.rank = topCard.rank;
    img.classList.add("card");
    img.id = topCard.id;

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop(); 
        renderStock();
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ---- DRAG & DROP ----
function addDragBehavior(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", card.id);
    });
}

function addDropZone(zone) {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        const cardEl = document.getElementById(cardId);
        if (cardEl) zone.appendChild(cardEl);
    });
}

// ---- CREATE TABLEAU (7 piles, fan cards) ----
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.innerHTML = `<strong>Pile ${i+1}</strong>`;
    tableauDiv.appendChild(pile);
    addDropZone(pile);
    tableauPiles.push(pile);
}

// Deal cards to tableau
let deckIndex = 0;
for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
        const cardData = deck[deckIndex++];
        const img = document.createElement("img");
        img.src = backImg;
        img.dataset.front = cardData.img;
        img.dataset.id = cardData.id;
        img.dataset.type = cardData.type;
        img.dataset.rank = cardData.rank;
        img.classList.add("card");
        img.id = cardData.id;

        // Bottom card face up
        if (j === i) img.src = cardData.img;

        addDragBehavior(img);
        tableauPiles[i].appendChild(img);
    }
}

// ---- CREATE FOUNDATIONS ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    addDropZone(f);
});

// ---- START GAME ----
renderStock();

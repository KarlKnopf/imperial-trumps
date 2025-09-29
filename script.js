const backImg = "images/back/card78.png";
let deck = [];

// ---- BUILD DECK ----
function buildDeck() {
    let idCounter = 0;
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) {
        deck.push({
            id: `major${i}`,
            type: "major",
            rank: i + 1,
            img: `images/major/card${i}.png`
        });
    }
    // Keys 22-35
    for (let i = 22; i <= 35; i++) {
        deck.push({
            id: `keys${i}`,
            type: "keys",
            rank: i - 21,
            img: `images/keys/card${i}.png`
        });
    }
    // Cups 36-49
    for (let i = 36; i <= 49; i++) {
        deck.push({
            id: `cups${i}`,
            type: "cups",
            rank: i - 35,
            img: `images/cups/card${i}.png`
        });
    }
    // Swords 50-63
    for (let i = 50; i <= 63; i++) {
        deck.push({
            id: `swords${i}`,
            type: "swords",
            rank: i - 49,
            img: `images/swords/card${i}.png`
        });
    }
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) {
        deck.push({
            id: `pentacles${i}`,
            type: "pentacles",
            rank: i - 63,
            img: `images/pentacles/card${i}.png`
        });
    }
}

// ---- SHUFFLE ----
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- INITIALIZE GAME ----
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");
const drawPileDiv = document.getElementById("draw-pile"); // optional draw pile

let stockStack = [...deck]; // copy of shuffled deck

// ---- CREATE TABLEAU ----
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.dataset.index = i;
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);

    pile.addEventListener("dragover", (e) => e.preventDefault());
    pile.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        const cardEl = document.getElementById(cardId);
        if (cardEl) pile.appendChild(cardEl);
    });
}

// ---- CREATE FOUNDATIONS ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);

    f.addEventListener("dragover", (e) => e.preventDefault());
    f.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        const cardEl = document.getElementById(cardId);
        if (cardEl) f.appendChild(cardEl);
    });
});

// ---- CREATE CARD ELEMENT ----
function createCardElement(card, faceUp = false) {
    const img = document.createElement("img");
    img.id = card.id;
    img.src = faceUp ? card.img : backImg;
    img.dataset.front = card.img;
    img.dataset.type = card.type;
    img.dataset.rank = card.rank;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", img.id);
    });

    return img;
}

// ---- DEAL TABLEAU ----
function dealTableau() {
    let index = 0;
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        for (let j = 0; j <= pileIndex; j++) {
            const faceUp = (j === pileIndex); // bottom card face up
            const card = stockStack[index];
            const cardEl = createCardElement(card, faceUp);
            tableauPiles[pileIndex].appendChild(cardEl);
            index++;
        }
    }
    // remove dealt cards from stock
    stockStack = stockStack.slice(28);
    renderStock();
}

// ---- RENDER STOCK ----
function renderStock() {
    stockDiv.innerHTML = "";
    stockStack.forEach(card => {
        const img = createCardElement(card, false);
        img.addEventListener("click", () => {
            // flip the card
            img.src = img.src.includes(backImg) ? img.dataset.front : backImg;

            // move card to draw pile
            drawPileDiv.appendChild(img);
            stockStack = stockStack.filter(c => c.id !== card.id);
            renderStock();
        });
        stockDiv.appendChild(img);
    });
}

// ---- START GAME ----
dealTableau();

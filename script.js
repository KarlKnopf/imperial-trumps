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
// INIT
// ----------------------
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// STOCK
// ----------------------
let stockStack = [...deck];

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
    img.setAttribute("draggable", "true");

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        fanTableau(); // refresh tableau in case needed
        renderStock();
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ----------------------
// DRAG BEHAVIOR
// ----------------------
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank
        }));
    });
}

// ----------------------
// TABLEAU (7 piles)
// ----------------------
let tableauPiles = [];

for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.dataset.index = i;
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);

    pile.addEventListener("dragover", (e) => e.preventDefault());
    pile.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const card = findCardInDOM(cardData.type, cardData.rank);
        if (card) pile.appendChild(card);
        fanTableau();
    });
}

// Deal to tableau (like Klondike: 1-7 cards)
for (let i = 0; i < tableauPiles.length; i++) {
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
        tableauPiles[i].appendChild(img);
    }
}

// ----------------------
// FAN TABLEAU
// ----------------------
function fanTableau() {
    tableauPiles.forEach(pile => {
        const cards = pile.querySelectorAll(".card");
        cards.forEach((card, i) => {
            card.style.position = "absolute";
            card.style.top = `${i * 20}px`; // vertical offset
            card.style.left = `0px`;
        });
    });
}

// ----------------------
// FIND CARD IN DOM
// ----------------------
function findCardInDOM(type, rank) {
    return document.querySelector(`.card[data-type="${type}"][data-rank="${rank}"]`);
}

// ----------------------
// FOUNDATIONS
// ----------------------
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
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const card = findCardInDOM(cardData.type, cardData.rank);
        if (card && cardData.type === suit) f.appendChild(card);
        fanTableau();
    });
});

// ----------------------
// START GAME
// ----------------------
fanTableau();
renderStock();

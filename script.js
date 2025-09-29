// ---- CONFIG ----
const backImg = "images/back/card78.png";
let deck = [];

// ---- BUILD DECK ----
function buildDeck() {
    for (let i = 0; i <= 21; i++) deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png` });
    for (let i = 22; i <= 35; i++) deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    for (let i = 36; i <= 49; i++) deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    for (let i = 50; i <= 63; i++) deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    for (let i = 64; i <= 77; i++) deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png` });
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
let stockStack = [...deck];

// ---- STOCK RENDER ----
function renderStock() {
    stockDiv.innerHTML = "";
    if (!stockStack.length) return;

    const topCard = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.src = backImg;
    img.dataset.front = topCard.img;
    img.dataset.type = topCard.type;
    img.dataset.rank = topCard.rank;
    img.classList.add("card");

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });
    stockDiv.appendChild(img);
}

// ---- CREATE FOUNDATIONS ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

// ---- CREATE TABLEAU ----
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative";
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// ---- DEAL TABLEAU ----
let dealIndex = 0;
for (let col = 0; col < 7; col++) {
    const pile = tableauPiles[col];
    for (let row = 0; row <= col; row++) {
        const cardData = stockStack[dealIndex];
        const img = document.createElement("img");
        img.classList.add("card");
        img.dataset.type = cardData.type;
        img.dataset.rank = cardData.rank;

        // Bottom card face-up
        img.src = row === col ? cardData.img : backImg;

        // Fan offsets
        img.style.position = "absolute";
        img.style.top = `${row * 30}px`;
        img.style.left = `${row * 5}px`;
        img.style.zIndex = row;

        pile.appendChild(img);
        addDragBehavior(img);
        dealIndex++;
    }
}
stockStack = stockStack.slice(dealIndex);

// ---- DRAG & DROP ----
function addDragBehavior(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.src
        }));
    });
}

// Tableau drop
tableauPiles.forEach(pile => {
    pile.addEventListener("dragover", e => e.preventDefault());
    pile.addEventListener("drop", e => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const droppedCard = document.createElement("img");
        droppedCard.src = cardData.src;
        droppedCard.dataset.type = cardData.type;
        droppedCard.dataset.rank = cardData.rank;
        droppedCard.classList.add("card");

        // Position on top of last card
        const row = pile.children.length;
        droppedCard.style.position = "absolute";
        droppedCard.style.top = `${row * 30}px`;
        droppedCard.style.left = `${row * 5}px`;
        droppedCard.style.zIndex = row;

        addDragBehavior(droppedCard);
        pile.appendChild(droppedCard);

        // Remove from stock
        stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
        renderStock();
    });
});

// ---- START GAME ----
renderStock();

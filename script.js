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

let stockStack = [...deck]; // copy

// ----------------------
// CREATE TABLEAU PILES
// ----------------------
let tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// ----------------------
// CREATE FOUNDATIONS
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
let foundationDivs = [];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    foundationDivs.push(f);
});

// ----------------------
// DRAG & DROP
// ----------------------
function addDragBehavior(card) {
    card.setAttribute("draggable", true);
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", null); // some browsers need this
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;
        targetDiv.appendChild(dragging);
    });
}

// Enable dropping on all piles and foundations
tableauPiles.forEach(enableDrop);
foundationDivs.forEach(enableDrop);

// ----------------------
// RENDER STOCK
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

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ----------------------
// DEAL TO TABLEAU
// ----------------------
function dealTableau() {
    let index = 0;
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
            const cardData = stockStack[index];
            const img = document.createElement("img");
            img.src = backImg;
            img.dataset.front = cardData.img;
            img.dataset.type = cardData.type;
            img.dataset.rank = cardData.rank;
            img.classList.add("card");

            // Face up for bottom card
            if (row === col) img.src = cardData.img;

            addDragBehavior(img);

            img.style.position = "absolute";
            img.style.top = `${row * 30}px`; // fan offset
            tableauPiles[col].appendChild(img);

            index++;
        }
    }

    stockStack = stockStack.slice(28); // remaining go to stock
    renderStock();
}

// ----------------------
// START GAME
// ----------------------
dealTableau();

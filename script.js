// ---- CARD DATA ----
const backImg = "images/back/card78.png";
let deck = [];

// Build deck
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

// ---- DOM ELEMENTS ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ---- STOCK ----
let stockStack = [];

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

    stockDiv.appendChild(img);
}

// ---- TABLEAU ----
const tableauPiles = [];

function createTableau() {
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.innerHTML = `<strong>Pile ${i+1}</strong>`;
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);
    }
}

function fanTableauPile(pile) {
    const cards = Array.from(pile.querySelectorAll(".card"));
    cards.forEach((c, index) => {
        c.style.position = "absolute";
        c.style.top = `${index * 30}px`;
        c.style.left = "0";
    });
}

// ---- FOUNDATIONS ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
function createFoundations() {
    foundationSuits.forEach(suit => {
        const f = document.createElement("div");
        f.classList.add("foundation");
        f.dataset.suit = suit;
        f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
        foundationsDiv.appendChild(f);
    });
}

// ---- INIT ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

createTableau();
createFoundations();
renderStock();
tableauPiles.forEach(p => fanTableauPile(p));

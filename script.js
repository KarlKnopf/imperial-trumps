const backImg = "images/back/card78.png";
let deck = [];

// --- Build Deck ---
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

// --- Shuffle ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Initialize ---
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

let stockStack = [...deck];

// --- Render Stock ---
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
    });

    stockDiv.appendChild(img);
}

// --- Tableau ---
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// ---- DEAL TABLEAU ----
const tableauPiles = [];

// Create 7 piles in the DOM
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative"; // allow absolute positioning for stacked cards
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// Deal cards from stockStack
let dealIndex = 0;
for (let col = 0; col < 7; col++) {
    const pile = tableauPiles[col];
    for (let row = 0; row <= col; row++) {
        const cardData = stockStack[dealIndex];
        const img = document.createElement("img");
        img.classList.add("card");
        img.dataset.type = cardData.type;
        img.dataset.rank = cardData.rank;

        // Only bottom card is face-up
        img.src = row === col ? cardData.img : backImg;

        // Stack cards visually
        img.style.position = "absolute";
        img.style.top = `${row * 30}px`; // overlap
        img.style.left = `0px`;
        img.style.zIndex = row;

        pile.appendChild(img);
        dealIndex++;
    }
}

// Remove dealt cards from stock
stockStack = stockStack.slice(dealIndex);
renderStock();



// --- Foundations ---
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

const backImg = "images/back/card78.png";
let deck = [];

// ---- Build deck ----
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

// ---- Initialize Game ----
buildDeck();
deck = shuffle(deck);

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// Create stock
deck.forEach(card => {
    const img = document.createElement("img");
    img.src = backImg;
    img.dataset.front = card.img;
    img.dataset.type = card.type;
    img.dataset.rank = card.rank;
    img.classList.add("card");

    // Click to flip stock card
    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
});

// Create tableau (7 piles)
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
}

// Create foundations (keys, cups, swords, pentacles, major)
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

// ---- Stock stack array ----
let stockStack = [...deck]; // copy of shuffled deck

const stockDiv = document.getElementById("stock");

// Function to show top card
function renderStock() {
    stockDiv.innerHTML = ""; // clear previous
    if (stockStack.length === 0) return; // empty stock

    const topCard = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.src = backImg; 
    img.dataset.front = topCard.img;
    img.dataset.type = topCard.type;
    img.dataset.rank = topCard.rank;
    img.classList.add("card");

    img.addEventListener("click", () => {
        // flip the card
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;

        // move to tableau or foundation logic can be added here
        // for now, just remove from stock as "drawn"
        stockStack.pop(); 
        renderStock(); // refresh top card
    });

    stockDiv.appendChild(img);
}

// Initial render
renderStock();


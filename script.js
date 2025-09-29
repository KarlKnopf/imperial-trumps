// ----------------------
// ---- CONFIG & DECK ----
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];
const darkSuits = ["swords", "keys"];
const lightSuits = ["cups", "pentacles"];

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

// Shuffle utility
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------
// ---- DOM ELEMENTS ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// ---- GAME STATE ----
let stockStack = [];
const tableauPiles = [];

// ----------------------
// ---- HELPER FUNCTIONS ----
function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// Check Imperial Trumps foundation rule
function canPlayToFoundation(card, foundationDiv) {
    const top = getTopCard(foundationDiv);

    if (card.type === "major") {
        return !top || (card.rank === parseInt(top.dataset.rank) + 1);
    } else {
        // minor arcana requires major arcana of same rank first
        const requiredMajorRank = card.rank;
        const majorFoundation = document.querySelector('.foundation[data-suit="major"]');
        const topMajor = getTopCard(majorFoundation);
        if (!topMajor || parseInt(topMajor.dataset.rank) < requiredMajorRank) return false;

        return !top || (card.type === top.dataset.type && parseInt(top.dataset.rank) + 1 === card.rank);
    }
}

// Drag behavior
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.src
        }));
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

// Enable drop zones
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());

    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        const movingType = dragging.dataset.type;
        const movingRank = parseInt(dragging.dataset.rank);

        if (targetDiv.classList.contains("tableau-pile")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) {
                    return; // illegal move
                }
            } else {
                if (movingRank !== 14) return; // only King on empty tableau
            }
        }

        if (targetDiv.classList.contains("foundation")) {
            if (!canPlayToFoundation(dragging, targetDiv)) return;
        }

        targetDiv.appendChild(dragging);

        // Remove from stock if needed
        stockStack = stockStack.filter(c => !(c.type === movingType && c.rank == movingRank));
    });
}

// Render stock
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
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// Deal tableau
function dealTableau() {
    let index = 0;
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);
        enableDrop(pile);

        for (let j = 0; j <= i; j++) {
            const card = stockStack[index++];
            const img = document.createElement("img");
            img.src = backImg;
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", "true");

            if (j === i) img.src = card.img; // top card face up

            addDragBehavior(img);
            pile.appendChild(img);
        }
    }
    stockStack = stockStack.slice(index);
}

// ----------------------
// ---- INIT GAME ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

dealTableau();

// Foundations
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

renderStock();

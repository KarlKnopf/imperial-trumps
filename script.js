// ----------------------
// CONFIGURATION
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];
const darkSuits = ["swords", "pentacles"];
const lightSuits = ["cups", "keys"];

// ----------------------
// BUILD DECK
// ----------------------
function buildDeck() {
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) {
        deck.push({ type: "major", rank: i, img: `images/major/card${i}.png` });
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
// SHUFFLE DECK
// ----------------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------
// GLOBAL ELEMENTS
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// STOCK & TABLEAU DATA
// ----------------------
let stockStack = [];
const tableauPiles = [];

// ----------------------
// HELPER FUNCTIONS
// ----------------------
function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
    });
}

// ----------------------
// ENABLE DROP ZONES
// ----------------------
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());

    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        const movingType = dragging.dataset.type;
        const movingRank = parseInt(dragging.dataset.rank);

        // --- Tableau Rules ---
        if (targetDiv.classList.contains("tableau-pile")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) return;
            } else {
                if (movingRank !== 14) return; // only King can go to empty pile
            }
        }

        // --- Foundation Rules ---
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            const suit = targetDiv.dataset.suit;

            if (suit === "major") {
                if (top) {
                    const topRank = parseInt(top.dataset.rank);
                    if (topRank === 21) {
                        if (movingRank !== 0) return; // Fool last
                    } else {
                        if (movingRank !== topRank + 1) return;
                    }
                } else {
                    if (movingRank === 0) return; // Fool cannot start
                }
            } else {
                if (top) {
                    const topRank = parseInt(top.dataset.rank);
                    if (movingRank !== topRank + 1 || movingType !== suit) return;
                } else {
                    if (movingRank !== 1) return;
                }
            }
        }

        // Move the card
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if affected
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ----------------------
// FAN TABLEAU PILE
// ----------------------
function fanTableauPile(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.position = "absolute";
        card.style.top = `${i * 30}px`;
        card.style.left = `0px`;
    });
}

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
    img.setAttribute("draggable", "true");
    addDragBehavior(img);

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
}

// ----------------------
// DEAL TABLEAU
// ----------------------
function dealTableau() {
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.style.position = "relative";
        pile.style.width = "120px";
        pile.style.height = "400px";
        pile.style.display = "inline-block";
        pile.style.marginRight = "20px";
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);

        for (let j = 0; j <= i; j++) {
            const card = stockStack.pop();
            const img = document.createElement("img");
            img.src = j === i ? card.img : backImg; // bottom card face up
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", "true");
            addDragBehavior(img);
            pile.appendChild(img);
        }
        fanTableauPile(pile);
    }
}

// ----------------------
// CREATE FOUNDATIONS
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.style.display = "inline-block";
    f.style.width = "120px";
    f.style.height = "200px";
    f.style.margin = "0 10px";
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ----------------------
// INITIALIZE GAME
// ----------------------
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];
dealTableau();
tableauPiles.forEach(p => enableDrop(p));
renderStock();

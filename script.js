// ----------------------
// CONFIG & DECK
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

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
// UTILITY FUNCTIONS
// ----------------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.dataset.front || card.src
        }));
        card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function isOppositeColor(a, b) {
    const darkSuits = ["keys", "swords"];
    const lightSuits = ["cups", "pentacles"];
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ----------------------
// DOM ELEMENTS
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

const tableauPiles = [];
let stockStack = [];

// ----------------------
// DEAL TABLEAU
// ----------------------
function dealTableau() {
    tableauDiv.innerHTML = "";
    tableauPiles.length = 0;

    let deckIndex = 0;

    for (let col = 0; col < 7; col++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.style.position = "relative";
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);

        for (let row = 0; row <= col; row++) {
            const card = deck[deckIndex++];
            const img = document.createElement("img");
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.style.position = "absolute";
            img.style.top = `${row * 30}px`;
            img.style.left = `0px`;
            img.setAttribute("draggable", "true");
            addDragBehavior(img);

            // **Set face-down for all but the last card**
            if (row === col) {
                img.src = card.img; // bottom card face up
            } else {
                img.src = backImg;   // face-down
            }

            pile.appendChild(img);
        }
    }
}


    // Flip bottom card in each pile
    tableauPiles.forEach(pile => {
        const bottom = getTopCard(pile);
        if (bottom) bottom.src = bottom.dataset.front;
    });
}

// ----------------------
// ENABLE DROP
// ----------------------
// ---- Enable drop zones ----
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
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) {
                    return; // illegal move
                }
            } else {
                if (movingRank !== 14) return; // only King can go to empty tableau pile
            }
        }

        // --- Foundation Rules ---
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            const suit = targetDiv.dataset.suit;

            if (suit === "major") {
                // Major arcana: ascending order, Fool (0) must be last
                if (top) {
                    const topRank = parseInt(top.dataset.rank);
                    if (topRank === 21) { // card before Fool
                        if (movingRank !== 0) return; // only Fool can be placed last
                    } else {
                        if (movingRank !== topRank + 1) return; // must follow ascending order
                    }
                } else {
                    if (movingRank === 0) return; // Fool cannot be first
                }
            } else {
                // Other suits: ascending order starting from Ace = 1
                if (top) {
                    const topRank = parseInt(top.dataset.rank);
                    if (movingRank !== topRank + 1 || movingType !== suit) return;
                } else {
                    if (movingRank !== 1) return; // must start with Ace
                }
            }
        }

        // --- Move the card ---
        targetDiv.appendChild(dragging);

        // --- Re-fan tableau piles if affected ---
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}


// ----------------------
// FAN TABLEAU
// ----------------------
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.top = `${index * 30}px`;
        card.style.left = "0px";
    });
}

// ----------------------
// INITIALIZE FOUNDATIONS
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ----------------------
// INITIALIZE STOCK
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
        stockStack.pop();
        renderStock();
    });

    stockDiv.appendChild(img);
}

// ----------------------
// START GAME
// ----------------------
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

dealTableau();
tableauPiles.forEach(p => enableDrop(p));
renderStock();

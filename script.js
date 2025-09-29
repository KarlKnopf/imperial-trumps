// =====================
// Imperial Trumps JS
// =====================

// ---- Deck Setup ----
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

// Build + shuffle
buildDeck();
// deck = shuffle(deck);

// ---- DOM references ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ---- Helpers ----
const darkSuits = ["keys", "swords"];
const lightSuits = ["cups", "pentacles"];

function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ---- Tableau + Stock data ----
const tableauPiles = [];
let stockStack = [];

// Deal to tableau
function dealTableau() {
    // ---- Tableau ----
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.dataset.index = i;
    tableauDiv.appendChild(pile);

    // store reference
    tableauPiles.push(pile);

    // enable dropping
    enableDrop(pile);
}

    // Deal cards
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = deck.pop();
            const img = document.createElement("img");
            img.src = (j === i) ? card.img : backImg;  // top card face-up
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", "true");
            addDragBehavior(img);
            tableauPiles[i].appendChild(img);
        }
        fanTableauPile(tableauPiles[i]);
    }

    stockStack = [...deck];
    renderStock();
}

// ---- Fan piles visually ----
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((c, i) => {
        c.style.top = `${60 + i * 30}px`;
        c.style.position = "absolute";
        c.style.left = "0px";
    });
}

// ---- Stock rendering ----
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

// ---- Drag & Drop ----
function addDragBehavior(card) {
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

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
                if (movingRank !== 14) return; // only King can go to empty pile
            }
        }

        // --- Foundation Rules ---
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(movingType === topType && movingRank === topRank + 1)) {
                    return; // illegal move
                }
            } else {
                if (movingRank !== 1) return; // must start with Ace
            }
        }

        // Move card
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if affected
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ---- Foundations ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ---- Initialize everything ----
dealTableau();

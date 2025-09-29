// ======================
//  IMPERIAL TRUMPS
// ======================

// --- Card image paths ---
const backImg = "images/back/card78.png";
let deck = [];

// --- Suits grouped by color ---
const darkSuits = ["swords", "keys"];
const lightSuits = ["cups", "pentacles"];

// --- Build Deck ---
function buildDeck() {
    // Major Arcana 0–21  (Fool is 0, Magician is 1)
    for (let i = 0; i <= 21; i++) {
        deck.push({ type: "major", rank: i, img: `images/major/card${i}.png` });
    }
    // Keys 22–35
    for (let i = 22; i <= 35; i++) {
        deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    }
    // Cups 36–49
    for (let i = 36; i <= 49; i++) {
        deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    }
    // Swords 50–63
    for (let i = 50; i <= 63; i++) {
        deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    }
    // Pentacles 64–77
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

// --- DOM References ---
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// --- Tableau piles + stock ---
const tableauPiles = [];
let stockStack = [];

// ============================
//       SETUP
// ============================
buildDeck();
shuffle(deck);

// Deal 7 tableau piles like Klondike
function dealTableau() {
    let index = 0;
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        tableauPiles.push(pile);
        tableauDiv.appendChild(pile);

        for (let j = 0; j <= i; j++) {
            const card = deck[index++];
            const img = document.createElement("img");
            img.classList.add("card");
            img.draggable = true;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.dataset.front = card.img;
            // all face-down except top card
            img.src = (j === i) ? card.img : backImg;
            pile.appendChild(img);
            addDragBehavior(img);
        }
        fanTableauPile(pile);
    }

    // remaining go to stock
    stockStack = deck.slice(index);
    renderStock();
}

// ============================
//       FAN CARDS
// ============================
function fanTableauPile(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.position = "absolute";
        card.style.left = "0px";
        card.style.top = `${i * 30}px`;       // vertical offset
        card.style.zIndex = i;
    });
}

// ============================
//       STOCK
// ============================
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.classList.add("card");
    img.src = backImg;
    img.dataset.front = topCard.img;
    img.dataset.type = topCard.type;
    img.dataset.rank = topCard.rank;
    img.draggable = true;

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
}

// ============================
//       HELPERS
// ============================
function addDragBehavior(card) {
    card.addEventListener("dragstart", () => {
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
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ============================
//       DROP LOGIC
// ============================
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());

    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        const movingType = dragging.dataset.type;
        const movingRank = parseInt(dragging.dataset.rank);

        // ----- Tableau rules -----
        if (targetDiv.classList.contains("tableau-pile")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) {
                    return; // invalid
                }
            } else {
                if (movingRank !== 14) return; // King only to empty pile
            }

            dragging.style.position = "absolute";
            dragging.style.left = "0px";
        }

        // ----- Foundation rules -----
        } else {
    if (targetDiv.dataset.suit === "major") {
        // Major Arcana starts with Magician (rank 1)
        if (movingRank !== 1) return;
    } else {
        // Other suits start with Ace
        if (movingRank !== 1) return;
    }
}


            dragging.style.position = "absolute";
            dragging.style.left = "0px";
            dragging.style.top = `${targetDiv.querySelectorAll(".card").length * 5}px`;
        }

        targetDiv.appendChild(dragging);

        // re-fan
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ============================
//       FOUNDATIONS
// ============================
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ============================
//       START GAME
// ============================
dealTableau();
tableauPiles.forEach(p => enableDrop(p));

// ---- Card Data ----
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

// ---- Shuffle deck ----
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- DOM Elements ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ---- Tableau + Stock data ----
const tableauPiles = [];
let stockStack = [];

// ---- Initialize Game ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

// ---- Render Stock ----
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

    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: img.dataset.type,
            rank: img.dataset.rank,
            src: img.dataset.front
        }));
        img.classList.add("dragging");
    });

    img.addEventListener("dragend", (e) => {
        img.classList.remove("dragging");
    });

    stockDiv.appendChild(img);
}

// ---- Tableau Functions ----
function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function fanTableauPile(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    cards.forEach((c, i) => {
        c.style.position = "absolute";
        c.style.top = `${i * 30}px`; // vertical offset for fan
    });
}

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

            // Append and fan cards
            targetDiv.appendChild(dragging);
            fanTableauPile(targetDiv);
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

            // Append to foundation
            targetDiv.appendChild(dragging);
            // Make card stack nicely in foundation
            dragging.style.position = "absolute";
            dragging.style.top = `${targetDiv.querySelectorAll(".card").length * 5}px`; // 5px offset
            dragging.style.left = "0";
        }

        // Refresh old tableau pile if affected
        if (oldPile && oldPile.classList.contains("tableau-pile")) {
            fanTableauPile(oldPile);
        }
    });
}


// ---- Utility ----
const darkSuits = ["keys", "swords"];
const lightSuits = ["cups", "pentacles"];
function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ---- Create Tableau ----
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.style.position = "relative";
    pile.style.width = "120px";
    pile.style.height = "400px";
    pile.style.margin = "10px";
    pile.style.border = "2px dashed #555";
    pile.innerHTML = `<strong>Pile ${i + 1}</strong>`;
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
    enableDrop(pile);
}

// ---- Create Foundations ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.style.width = "120px";
    f.style.height = "180px";
    f.style.margin = "10px";
    f.style.border = "2px solid #000";
    f.style.display = "inline-block";
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ---- Deal Tableau ----
function dealTableau() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = stockStack.pop();
            const img = document.createElement("img");
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.dataset.front = card.img;
            img.src = j === i ? card.img : backImg;
            img.classList.add("card");
            img.setAttribute("draggable", "true");

            img.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify({
                    type: img.dataset.type,
                    rank: img.dataset.rank,
                    src: img.dataset.front
                }));
                img.classList.add("dragging");
            });

            img.addEventListener("dragend", () => img.classList.remove("dragging"));

            tableauPiles[i].appendChild(img);
            fanTableauPile(tableauPiles[i]);
        }
    }
}

// ---- Start Game ----
dealTableau();
renderStock();

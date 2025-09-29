// ---- CONFIG ----
const backImg = "images/back/card78.png";

// ---- DECK ----
let deck = [];
function buildDeck() {
    // Major Arcana 0-21
    for (let i = 0; i <= 21; i++) deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png` });
    // Keys 22-35
    for (let i = 22; i <= 35; i++) deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    // Cups 36-49
    for (let i = 36; i <= 49; i++) deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    // Swords 50-63
    for (let i = 50; i <= 63; i++) deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png` });
}

// ---- SHUFFLE ----
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

// ---- TABLEAU AND STOCK ----
const tableauPiles = [];
let stockStack = [];

// ---- HELPER FUNCTIONS ----
function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

const darkSuits = ["keys", "swords"];
const lightSuits = ["cups", "pentacles"];
function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) || (lightSuits.includes(a) && darkSuits.includes(b));
}

// ---- FAN TABLEAU ----
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.top = `${i * 30}px`;
    });
}

// ---- DRAG BEHAVIOR ----
function addDragBehavior(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
    });
}

// ---- ENABLE DROP ----
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        const movingType = dragging.dataset.type;
        const movingRank = parseInt(dragging.dataset.rank);

        // --- Tableau rules ---
        if (targetDiv.classList.contains("tableau-pile")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;

                if (movingType === "major") {
                    if (!(topType === "major" && movingRank === topRank - 1)) return;
                } else {
                    if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) return;
                }
            } else {
                if (movingType === "major" && movingRank !== 22) return;
                if (movingType !== "major" && movingRank !== 14) return;
            }
        }

        // --- Foundation rules ---
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(movingType === topType && movingRank === topRank + 1)) return;
            } else {
                if (movingType !== "major" && movingRank !== 1) return;
                if (movingType === "major" && movingRank !== 1) return;
            }
        }

        // Move card
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ---- RENDER STOCK ----
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
        img.src = img.src === backImg ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ---- DEAL TABLEAU ----
function dealTableau() {
    let deckIndex = 0;
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);
        enableDrop(pile);

        for (let j = 0; j <= i; j++) {
            const cardData = deck[deckIndex++];
            const card = document.createElement("img");
            card.src = cardData.img;
            card.dataset.type = cardData.type;
            card.dataset.rank = cardData.rank;
            card.classList.add("card");
            addDragBehavior(card);
            pile.appendChild(card);
        }
        fanTableauPile(pile);
    }
}

// ---- FOUNDATIONS ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ---- INITIALIZE GAME ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];
dealTableau();
renderStock();

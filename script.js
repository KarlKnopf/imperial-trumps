// ---- GLOBALS ----
const backImg = "images/back/card78.png";
let deck = [];
const darkSuits = ["swords", "pentacles"];
const lightSuits = ["keys", "cups"];

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

const tableauPiles = [];
let stockStack = [];

// ---- BUILD DECK ----
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
    img.setAttribute("draggable", "true");

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ---- DRAG BEHAVIOR ----
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.src
        }));
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

// ---- HELPERS ----
function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
}

function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
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

        // Tableau rules
        if (targetDiv.classList.contains("tableau-pile")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) return;
            } else if (movingRank !== 14) return; // only King to empty
        }

        // Foundation rules
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(movingType === topType && movingRank === topRank + 1)) return;
            } else if (movingRank !== 1) return; // must start with Ace
        }

        // Move card
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if needed
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);

        renderStock();
    });
}

// ---- FAN TABLEAU PILE ----
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((c, i) => {
        c.style.top = `${i * 30}px`;
    });
}

// ---- DEAL TABLEAU ----
function dealTableau() {
    // Clear previous tableau
    tableauDiv.innerHTML = "";
    tableauPiles.length = 0;

    let deckIndex = 0;

    for (let col = 0; col < 7; col++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.style.position = "relative"; // allows stacking with offsets
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);

        for (let row = 0; row <= col; row++) {
            const card = deck[deckIndex++];
            const img = document.createElement("img");

            // All cards initially face down
            img.src = backImg;
            img.dataset.front = card.img; // store front image

            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.style.position = "absolute";
            img.style.top = `${row * 30}px`; // vertical fan offset
            img.style.left = `0px`;
            img.setAttribute("draggable", "true");
            addDragBehavior(img);

            pile.appendChild(img);
        }
    }

    // Flip only the bottom card of each pile
    flipTableauBottomCards();
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

// ---- INIT GAME ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];
renderStock();
dealTableau();
flipTableauBottomCards();
tableauPiles.forEach(p => enableDrop(p));

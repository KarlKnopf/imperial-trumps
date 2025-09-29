// ---- Card images ----
const backImg = "images/back/card78.png";
let deck = [];

// Suits
const suits = ["keys", "cups", "swords", "pentacles", "major"];
const darkSuits = ["keys", "swords"];
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

// ---- Shuffle deck ----
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- Initialize game ----
buildDeck();
deck = shuffle(deck);
let stockStack = [...deck];

// ---- Get HTML containers ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");
const tableauPiles = [];

// ---- Drag behavior ----
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.dataset.front
        }));
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
}

// ---- Enable drop zones ----
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if needed
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ---- Tableau fan spacing ----
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    const spacing = 30; // vertical spacing
    cards.forEach((c, i) => {
        c.style.position = "absolute";
        c.style.top = `${i * spacing}px`;
        c.style.left = "0px";
    });
}

// ---- Deal tableau ----
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
            if (!card) continue;
            const img = document.createElement("img");
            img.src = backImg;
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", "true");

            // Top card face up
            if (j === i) img.src = card.img;

            addDragBehavior(img);
            pile.appendChild(img);
        }
        fanTableauPile(pile);
    }
    stockStack = stockStack.slice(index);
}

// ---- Render stock ----
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
    stockDiv.appendChild(img);
}

// ---- Create foundations ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
    enableDrop(f);
});

// ---- Start game ----
dealTableau();
renderStock();

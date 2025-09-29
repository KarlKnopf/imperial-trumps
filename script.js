const backImg = "images/back/card78.png";
let deck = [];

// ----------------------
// BUILD DECK
// ----------------------
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ----------------------
// INIT GAME ELEMENTS
// ----------------------
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

let stockStack = [];

let tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

// ----------------------
// CARD ELEMENT
// ----------------------
function createCardElement(card, faceUp = false) {
    const img = document.createElement("img");
    img.src = faceUp ? card.img : backImg;
    img.dataset.front = card.img;
    img.dataset.type = card.type;
    img.dataset.rank = card.rank;
    img.classList.add("card");
    img.setAttribute("draggable", "true");

    img.addEventListener("click", () => {
        img.src = img.src === backImg ? img.dataset.front : backImg;
    });

    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.type,
            rank: card.rank,
            src: card.img
        }));
    });

    return img;
}

// ----------------------
// DEAL TABLEAU
// ----------------------
function dealTableau() {
    let index = 0;
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        for (let j = 0; j <= pileIndex; j++) {
            const card = stockStack[index];
            const faceUp = (j === pileIndex); // bottom card face up
            const cardEl = createCardElement(card, faceUp);
            cardEl.style.top = `${30 * j}px`; // stacked fan
            tableauPiles[pileIndex].appendChild(cardEl);
            index++;
        }
    }
    stockStack = stockStack.slice(28); // remove dealt cards
    renderStock();
}

// ----------------------
// RENDER STOCK
// ----------------------
function renderStock() {
    stockDiv.innerHTML = "";
    if (stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length - 1];
    const img = createCardElement(topCard, false);
    stockDiv.appendChild(img);
}

// ----------------------
// ENABLE DROPPING ON TABLEAU AND FOUNDATIONS
// ----------------------
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const cardEl = createCardElement(cardData, true);

        // Remove from previous pile or stock
        removeCardFromAllPiles(cardData);

        // Append to the drop target
        targetDiv.appendChild(cardEl);

        // Update fanning for tableau piles only
        if (targetDiv.classList.contains("tableau-pile")) {
            updateFan(targetDiv);
        }

        renderStock(); // refresh stock if needed
    });
}

function removeCardFromAllPiles(cardData) {
    // Stock
    stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
    // Tableau piles
    tableauPiles.forEach(pile => {
        Array.from(pile.children).forEach(child => {
            if (child.dataset.type === cardData.type && child.dataset.rank == cardData.rank) {
                pile.removeChild(child);
            }
        });
    });
    // Foundations
    Array.from(foundationsDiv.children).forEach(f => {
        Array.from(f.children).forEach(child => {
            if (child.dataset.type === cardData.type && child.dataset.rank == cardData.rank) {
                f.removeChild(child);
            }
        });
    });
}

// ----------------------
// UPDATE FANNING FOR TABLEAU
// ----------------------
function updateFan(pile) {
    const cards = Array.from(pile.children);
    cards.forEach((card, idx) => {
        card.style.top = `${30 * idx}px`;
    });
}

// ----------------------
// APPLY TO ALL PILES AND FOUNDATIONS
// ----------------------
tableauPiles.forEach(pile => enableDrop(pile));
Array.from(foundationsDiv.children).forEach(f => enableDrop(f));


// ----------------------
// START GAME
// ----------------------
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

dealTableau();

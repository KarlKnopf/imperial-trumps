// ----------------------
// CONFIG
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];
let stockStack = [];

// ----------------------
// BUILD DECK
// ----------------------
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
// INIT
// ----------------------
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

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
    addDragBehavior(img);

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
}

// ----------------------
// DRAG FUNCTION
// ----------------------
function addDragBehavior(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.src
        }));
    });
}

// ----------------------
// CREATE TABLEAU
// ----------------------
function dealTableau() {
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.innerHTML = `<strong>Pile ${pileIndex + 1}</strong>`;
        pile.style.position = "relative"; // allow absolute positioning for fan
        tableauDiv.appendChild(pile);

        pile.addEventListener("dragover", (e) => e.preventDefault());
        pile.addEventListener("drop", (e) => {
            e.preventDefault();
            const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
            const droppedCard = document.createElement("img");
            droppedCard.src = cardData.src;
            droppedCard.dataset.type = cardData.type;
            droppedCard.dataset.rank = cardData.rank;
            droppedCard.classList.add("card");
            droppedCard.style.position = "absolute";
            droppedCard.style.top = `${pile.children.length * 30}px`;
            addDragBehavior(droppedCard);
            pile.appendChild(droppedCard);

            // remove from stockStack if it was there
            stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
            renderStock();
        });

        // Deal cards
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
            const card = stockStack.pop();
            if (!card) continue;

            const img = document.createElement("img");
            img.src = (cardIndex === pileIndex) ? card.img : backImg;
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.style.position = "absolute";
            img.style.top = `${cardIndex * 30}px`;
            addDragBehavior(img);
            pile.appendChild(img);
        }
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
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    f.addEventListener("dragover", (e) => e.preventDefault());
    f.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const droppedCard = document.createElement("img");
        droppedCard.src = cardData.src;
        droppedCard.dataset.type = cardData.type;
        droppedCard.dataset.rank = cardData.rank;
        droppedCard.classList.add("card");
        addDragBehavior(droppedCard);
        f.appendChild(droppedCard);

        stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
        renderStock();
    });
    foundationsDiv.appendChild(f);
});

// ----------------------
// START GAME
// ----------------------
dealTableau();
renderStock();

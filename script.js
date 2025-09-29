// ----------------------
// GLOBAL VARIABLES
// ----------------------
const backImg = "images/back/card78.png";
let deck = [];

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
// DRAG BEHAVIOR
// ----------------------
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.src
        }));
    });
}

// ----------------------
// INITIALIZE GAME
// ----------------------
buildDeck();
deck = shuffle(deck);
let stockStack = [...deck];

const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

// ----------------------
// RENDER STOCK
// ----------------------
function renderStock() {
    stockDiv.innerHTML = ""; // clear
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
        // draw card logic
        stockStack.pop();
        renderStock();
    });

    stockDiv.appendChild(img);
}

// ----------------------
// CREATE TABLEAU (7 piles, fanned cards)
// ----------------------
// ---- Deal Tableau ----
function dealTableau() {
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        const pile = document.querySelectorAll(".tableau-pile")[pileIndex];

        // Deal pileIndex + 1 cards to this pile
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
            const card = stockStack.pop(); // take from stock
            if (!card) continue;

            // Find the stock img element
            const img = document.querySelector(`#stock img[data-rank='${card.rank}'][data-type='${card.type}']`);
            if (!img) continue;

            // Move img to the pile
            pile.appendChild(img);
            img.style.position = "absolute";
            img.style.top = `${cardIndex * 30}px`; // vertical fan
            img.style.left = "0px"; // aligned to left of pile

            // Optional: flip first card in pile face up
            if (cardIndex === pileIndex) {
                img.src = card.img;
            } else {
                img.src = backImg;
            }

            // Make draggable
            addDragBehavior(img);
        }
    }

    // Refresh stock after dealing
    renderStock();
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
    f.style.height = "180px";
    f.style.border = "2px dashed #333";
    f.style.marginRight = "20px";
    f.style.textAlign = "center";
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);

    f.addEventListener("dragover", (e) => e.preventDefault());
    f.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const droppedCard = document.createElement("img");
        droppedCard.src = cardData.src;
        droppedCard.dataset.type = cardData.type;
        droppedCard.dataset.rank = cardData.rank;
        droppedCard.classList.add("card");
        droppedCard.setAttribute("draggable", "true");
        addDragBehavior(droppedCard);
        f.appendChild(droppedCard);
        stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
        renderStock();
    });
});
dealTableau();
// ----------------------
// START GAME
// ----------------------
renderStock();

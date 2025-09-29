// ---- Globals ----
const backImg = "images/back/card78.png";
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");
const darkSuits = ["swords", "pentacles"];
const lightSuits = ["keys", "cups"];

let deck = [];
let stockStack = [];
let tableauPiles = [];

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

// ---- Shuffle ----
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- Initialize stock ----
function renderStock() {
    const stockDiv = document.getElementById("stock");
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
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });

    stockDiv.appendChild(img);
}

// ---- Tableau setup ----
function dealTableau() {
    tableauPiles = [];
    for (let i = 0; i < 7; i++) {
        const pileDiv = document.createElement("div");
        pileDiv.classList.add("tableau-pile");
        pileDiv.innerHTML = `<strong>Pile ${i + 1}</strong>`;
        tableauDiv.appendChild(pileDiv);
        tableauPiles.push(pileDiv);

        for (let j = 0; j <= i; j++) {
            const card = stockStack.pop();
            const img = document.createElement("img");
            img.src = j === i ? card.img : backImg; // last card face up
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", true);
            addDragBehavior(img);
            pileDiv.appendChild(img);
        }
    }
}

// ---- Foundations ----
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
function setupFoundations() {
    foundationSuits.forEach(suit => {
        const f = document.createElement("div");
        f.classList.add("foundation");
        f.dataset.suit = suit;
        f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
        foundationsDiv.appendChild(f);
        enableDrop(f);
    });
}

// ---- Drag/drop helpers ----
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
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

        // Tableau rules
        if (targetDiv.classList.contains("tableau-pile")) {
            const top = targetDiv.querySelector(".card:last-child");
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) return;
            } else if (movingRank !== 14) return; // only King to empty pile
        }

        // Foundation rules
        if (targetDiv.classList.contains("foundation")) {
            const top = targetDiv.querySelector(".card:last-child");
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(movingType === topType && movingRank === topRank + 1)) return;
            } else if (movingRank !== 1) return; // Ace starts
        }

        targetDiv.appendChild(dragging);
    });
}

function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ---- Init ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

setupFoundations();
dealTableau();
renderStock();
tableauPiles.forEach(p => enableDrop(p));

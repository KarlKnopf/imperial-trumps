document.addEventListener("DOMContentLoaded", () => {

const backImg = "images/back/card78.png";
let deck = [];

// ---- Build deck ----
function buildDeck() {
    for (let i = 0; i <= 21; i++) deck.push({ type: "major", rank: i + 1, img: `images/major/card${i}.png` });
    for (let i = 22; i <= 35; i++) deck.push({ type: "keys", rank: i - 21, img: `images/keys/card${i}.png` });
    for (let i = 36; i <= 49; i++) deck.push({ type: "cups", rank: i - 35, img: `images/cups/card${i}.png` });
    for (let i = 50; i <= 63; i++) deck.push({ type: "swords", rank: i - 49, img: `images/swords/card${i}.png` });
    for (let i = 64; i <= 77; i++) deck.push({ type: "pentacles", rank: i - 63, img: `images/pentacles/card${i}.png` });
}

// ---- Shuffle ----
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- Setup DOM ----
const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

buildDeck();
deck = shuffle(deck);
let stockStack = [...deck];

// ---- Deal Tableau (7 piles) ----
const tableauPiles = [];
for (let i = 0; i < 7; i++) {
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);

    for (let j = 0; j <= i; j++) {
        const card = stockStack.pop();
        const img = document.createElement("img");
        img.src = backImg;
        img.dataset.front = card.img;
        img.dataset.type = card.type;
        img.dataset.rank = card.rank;
        img.classList.add("card");
        img.style.top = `${j * 30}px`;

        img.addEventListener("click", () => {
            img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        });

        // Dragging
        img.setAttribute("draggable", true);
        img.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", JSON.stringify({
                type: img.dataset.type,
                rank: img.dataset.rank,
                src: img.src
            }));
            img.classList.add("dragging");
        });
        img.addEventListener("dragend", () => img.classList.remove("dragging"));

        pile.appendChild(img);
    }

    // Enable drop
    pile.addEventListener("dragover", e => e.preventDefault());
    pile.addEventListener("drop", e => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const dragged = document.querySelector(".dragging");
        if (!dragged) return;

        pile.appendChild(dragged);
        dragged.style.top = `${pile.childElementCount * 30}px`;
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

    f.addEventListener("dragover", e => e.preventDefault());
    f.addEventListener("drop", e => {
        e.preventDefault();
        const dragged = document.querySelector(".dragging");
        if (!dragged) return;
        f.appendChild(dragged);
        dragged.style.top = "0px";
    });
});

// ---- Stock render ----
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
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });
    stockDiv.appendChild(img);
}

renderStock();

});

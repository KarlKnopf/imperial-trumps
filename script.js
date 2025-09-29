const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

const backImg = "images/back/card78.png";
let deck = [];
let stockStack = [];
const tableauPiles = [];

// ---- Build deck ----
function buildDeck() {
    for (let i = 0; i <= 21; i++) deck.push({ type: "major", rank: i+1, img:`images/major/card${i}.png`});
    for (let i = 22; i <= 35; i++) deck.push({ type: "keys", rank: i-21, img:`images/keys/card${i}.png`});
    for (let i = 36; i <= 49; i++) deck.push({ type: "cups", rank: i-35, img:`images/cups/card${i}.png`});
    for (let i = 50; i <= 63; i++) deck.push({ type: "swords", rank: i-49, img:`images/swords/card${i}.png`});
    for (let i = 64; i <= 77; i++) deck.push({ type: "pentacles", rank: i-63, img:`images/pentacles/card${i}.png`});
}

function shuffle(array) {
    for (let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ---- Deal tableau ----
function dealTableau() {
    let deckIndex = 0;
    for (let i = 0; i < 7; i++) {
        const pile = tableauPiles[i];
        pile.innerHTML = ""; // clear any previous cards

        for (let j = 0; j <= i; j++) {
            const cardData = stockStack[deckIndex++];
            const card = document.createElement("img");
            card.dataset.type = cardData.type;
            card.dataset.rank = cardData.rank;
            card.dataset.front = cardData.img;
            card.classList.add("card");

            // Only bottom card face up
            if (j === i) {
                card.src = cardData.img;
            } else {
                card.src = backImg;
            }

            card.style.top = `${j * 30}px`; // fan effect
            card.style.left = "0px";

            // Enable dragging
            card.setAttribute("draggable", "true");
            addDragBehavior(card);

            pile.appendChild(card);
        }
    }

    // Remove dealt cards from stock
    stockStack = stockStack.slice(deckIndex);
    renderStock();
}

// ---- Add drag behavior ----
function addDragBehavior(card) {
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            type: card.dataset.type,
            rank: card.dataset.rank,
            src: card.dataset.front
        }));
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", (e) => {
        card.classList.remove("dragging");
    });
}

// ---- Enable drop zones for tableau and foundations ----
function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());
    targetDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const oldPile = dragging.parentElement;

        // TODO: add tableau/foundation rules here if needed
        targetDiv.appendChild(dragging);

        // Re-fan tableau piles
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ---- Fan cards in a tableau pile ----
function fanTableauPile(pile) {
    const cards = pile.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.top = `${index * 30}px`;
        card.style.left = "0px";
    });
}

// ---- Initialize game ----
dealTableau();
tableauPiles.forEach(p => enableDrop(p));
const foundationDivs = document.querySelectorAll(".foundation");
foundationDivs.forEach(f => enableDrop(f));


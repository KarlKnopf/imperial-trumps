// ---- Make card draggable ----
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
// CREATE TABLEAU (7 piles)
// ----------------------
for (let i = 0; i < 7; i++) {
    const offset = pile.children.length * 30; // vertical spacing
droppedCard.style.top = offset + "px";
    pile.classList.add("tableau-pile");
    pile.innerHTML = `<strong>Pile ${i + 1}</strong>`;
    tableauDiv.appendChild(pile);

    pile.addEventListener("dragover", (e) => e.preventDefault());
    pile.addEventListener("drop", (e) => handleDrop(e, pile));
}

// ----------------------
// CREATE FOUNDATIONS (5 suits)
// ----------------------
const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
foundationSuits.forEach(suit => {
    const f = document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit = suit;
    f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);

    f.addEventListener("dragover", (e) => e.preventDefault());
    f.addEventListener("drop", (e) => handleDrop(e, f));
});

// ----------------------
// DROP HANDLER
// ----------------------
function handleDrop(e, pile) {
    e.preventDefault();
    const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));

    const droppedCard = document.createElement("img");
    droppedCard.src = cardData.src;
    droppedCard.dataset.type = cardData.type;
    droppedCard.dataset.rank = cardData.rank;
    droppedCard.classList.add("card");
    addDragBehavior(droppedCard);

    pile.appendChild(droppedCard);

    // Remove from stock if it came from there
    stockStack = stockStack.filter(c => !(c.type === cardData.type && c.rank == cardData.rank));
    renderStock();
}

// ----------------------
// START GAME
// ----------------------
renderStock();


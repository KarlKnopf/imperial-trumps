// ---- Globals ----
const backImg = "images/back/card78.png";
let deck = [];
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");
let stockStack = [];
const tableauPiles = [];
const darkSuits = ["swords", "pentacles"];
const lightSuits = ["keys", "cups"];

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

// ---- Stock ----
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
    img.setAttribute("draggable", "true");

    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
        stockStack.pop();
        renderStock();
    });

    addDragBehavior(img);
    stockDiv.appendChild(img);
}

// ---- Drag behavior ----
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

// ---- Get top card of a pile ----
function getTopCard(pileDiv) {
    const pileCards = pileDiv.querySelectorAll(".card");
    return pileCards[pileCards.length - 1] || null;
}

// ---- Opposite color check ----
function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
}

// ---- Enable drop zones ----
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
            } else {
                if (movingRank !== 14) return; // King only
            }
        }

        // Foundation rules
        if (targetDiv.classList.contains("foundation")) {
            const top = getTopCard(targetDiv);
            if (top) {
                const topRank = parseInt(top.dataset.rank);
                const topType = top.dataset.type;
                if (!(movingType === topType && movingRank === topRank + 1)) return;
            } else {
                if (movingRank !== 1) return; // Ace/lowest card only
            }
        }

        targetDiv.appendChild(dragging);

        // Re-fan tableau piles if affected
        if (targetDiv.classList.contains("tableau-pile")) fanTableauPile(targetDiv);
        if (oldPile && oldPile.classList.contains("tableau-pile")) fanTableauPile(oldPile);
    });
}

// ---- Fan tableau pile ----
function fanTableauPile(pile) {
    const pileCards = pile.querySelectorAll(".card");
    pileCards.forEach((card, i) => {
        card.style.position = "absolute";
        card.style.top = `${i * 30}px`;
        card.style.left = "0px";
    });
}

// ---- Create tableau ----
function createTableau() {
    for (let i = 0; i < 7; i++) {
        const pile = document.createElement("div");
        pile.classList.add("tableau-pile");
        pile.innerHTML = `<strong>Pile ${i + 1}</strong>`;
        tableauDiv.appendChild(pile);
        tableauPiles.push(pile);
        enableDrop(pile);
    }
}

// ---- Create foundations ----
function createFoundations() {
    const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
    foundationSuits.forEach(suit => {
        const f = document.createElement("div");
        f.classList.add("foundation");
        f.dataset.suit = suit;
        f.innerHTML = `<strong>${suit.toUpperCase()}</strong>`;
        foundationsDiv.appendChild(f);
        enableDrop(f);
    });
}

// ---- Deal tableau ----
function dealTableau() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = stockStack.pop();
            if (!card) continue;
            const img = document.createElement("img");
            img.src = backImg; // face down initially
            img.dataset.front = card.img;
            img.dataset.type = card.type;
            img.dataset.rank = card.rank;
            img.classList.add("card");
            img.setAttribute("draggable", "true");
            addDragBehavior(img);
            tableauPiles[i].appendChild(img);
        }
        // Flip last card in pile face up
        const pileCards = tableauPiles[i].querySelectorAll(".card");
        if (pileCards.length > 0) {
            const topCard = pileCards[pileCards.length - 1];
            topCard.src = topCard.dataset.front;
        }
        fanTableauPile(tableauPiles[i]);
    }
}

// ---- Initialize game ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];
createTableau();
createFoundations();
renderStock();

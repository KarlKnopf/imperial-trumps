// Back of the cards
const backImg = "images/card78.png";

// Create deck array
let deck = [];

// Major Arcana: card0.png - card21.png
for (let i = 0; i <= 21; i++) {
    deck.push({
        type: "major",
        rank: i + 1,
        img: `images/card${i}.png`
    });
}

// Keys: card22.png - card35.png
for (let i = 22; i <= 35; i++) {
    deck.push({
        type: "keys",
        rank: i - 21,
        img: `images/card${i}.png`
    });
}

// Cups: card36.png - card49.png
for (let i = 36; i <= 49; i++) {
    deck.push({
        type: "cups",
        rank: i - 35,
        img: `images/card${i}.png`
    });
}

// Swords: card50.png - card63.png
for (let i = 50; i <= 63; i++) {
    deck.push({
        type: "swords",
        rank: i - 49,
        img: `images/card${i}.png`
    });
}

// Pentacles: card64.png - card77.png
for (let i = 64; i <= 77; i++) {
    deck.push({
        type: "pentacles",
        rank: i - 63,
        img: `images/card${i}.png`
    });
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

deck = shuffle(deck);

// Display a few cards for testing
const stockDiv = document.getElementById("stock");

deck.slice(0, 7).forEach(card => {
    const img = document.createElement("img");
    img.src = backImg;               // start face-down
    img.dataset.front = card.img;    // front of card
    img.dataset.type = card.type;
    img.dataset.rank = card.rank;
    img.classList.add("card");

    // Click to flip
    img.addEventListener("click", () => {
        img.src = img.src.includes(backImg) ? img.dataset.front : backImg;
    });

    stockDiv.appendChild(img);
});



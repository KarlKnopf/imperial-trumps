// Full Imperial Trumps deck
let deck = [];

// Major Arcana: card0.png - card21.png
for (let i = 0; i <= 21; i++) {
    deck.push({
        type: "major",
        rank: i + 1,         // optional: 1-22
        img: "images/card" + i + ".png"
    });
}

// Keys: card22.png - card35.png
for (let i = 22; i <= 35; i++) {
    deck.push({
        type: "keys",
        rank: (i - 21),      // 1-14
        img: "images/card" + i + ".png"
    });
}

// Cups: card36.png - card49.png
for (let i = 36; i <= 49; i++) {
    deck.push({
        type: "cups",
        rank: (i - 35),      // 1-14
        img: "images/card" + i + ".png"
    });
}

// Swords: card50.png - card63.png
for (let i = 50; i <= 63; i++) {
    deck.push({
        type: "swords",
        rank: (i - 49),      // 1-14
        img: "images/card" + i + ".png"
    });
}

// Pentacles: card64.png - card77.png
for (let i = 64; i <= 77; i++) {
    deck.push({
        type: "pentacles",
        rank: (i - 63),      // 1-14
        img: "images/card" + i + ".png"
    });
}

// Back image path (face-down)
const backImg = "images/card78.png";

let imgElement = document.createElement("img");
imgElement.src = backImg;
imgElement.dataset.front = deck[0].img; // reference front image
imgElement.dataset.type = deck[0].type;
imgElement.dataset.rank = deck[0].rank;
imgElement.classList.add("card");
document.body.appendChild(imgElement);


function flipCard(cardElement) {
    if (cardElement.src.includes("card78.png")) {
        cardElement.src = cardElement.dataset.front; // show front
    } else {
        cardElement.src = backImg; // flip back
    }
}


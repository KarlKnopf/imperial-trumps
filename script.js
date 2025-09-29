const stockDiv = document.getElementById("stock");
const tableauDiv = document.getElementById("tableau");
const foundationsDiv = document.getElementById("foundations");

const backImg = "images/back/card78.png"; // path to your back image
let deck = [];
let stockStack = [];

// Build deck
function buildDeck() {
    // Example: Major Arcana 0-21
    for (let i = 0; i <= 21; i++) deck.push({type: "major", rank: i+1, img: `images/major/card${i}.png`});
    // Keys 22-35
    for (let i = 22; i <= 35; i++) deck.push({type:"keys", rank:i-21, img:`images/keys/card${i}.png`});
    // Cups 36-49
    for (let i = 36; i <= 49; i++) deck.push({type:"cups", rank:i-35, img:`images/cups/card${i}.png`});
    // Swords 50-63
    for (let i = 50; i <= 63; i++) deck.push({type:"swords", rank:i-49, img:`images/swords/card${i}.png`});
    // Pentacles 64-77
    for (let i = 64; i <= 77; i++) deck.push({type:"pentacles", rank:i-63, img:`images/pentacles/card${i}.png`});
}

// Shuffle function
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i], array[j]]=[array[j], array[i]];
    }
    return array;
}

// Initialize game
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

// Render stock
function renderStock() {
    stockDiv.innerHTML = "";
    if(stockStack.length === 0) return;

    const topCard = stockStack[stockStack.length-1];
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

// Create tableau (7 piles)
for(let i=0;i<7;i++){
    const pile=document.createElement("div");
    pile.classList.add("tableau-pile");
    pile.dataset.index=i;
    tableauDiv.appendChild(pile);
}

// Create foundations
const foundationSuits=["keys","cups","swords","pentacles","major"];
foundationSuits.forEach(suit=>{
    const f=document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit=suit;
    foundationsDiv.appendChild(f);
});

// Deal cards to tableau (like Klondike)
for(let i=0;i<7;i++){
    const pileDiv = tableauDiv.children[i];
    for(let j=0;j<=i;j++){
        const cardData = stockStack.pop();
        const cardImg = document.createElement("img");
        cardImg.src = backImg;
        cardImg.dataset.front = cardData.img;
        cardImg.dataset.type = cardData.type;
        cardImg.dataset.rank = cardData.rank;
        cardImg.classList.add("card");
        cardImg.style.top = `${j*30}px`; // staggered stacking
        pileDiv.appendChild(cardImg);
    }
}

// Initial render
renderStock();

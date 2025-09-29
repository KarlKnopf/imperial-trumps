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

// ---- Initialize game ----
buildDeck();
deck = shuffle(deck);
stockStack = [...deck];

// ---- Create tableau ----
for (let i=0;i<7;i++){
    const pile = document.createElement("div");
    pile.classList.add("tableau-pile");
    tableauDiv.appendChild(pile);
    tableauPiles.push(pile);
}

// ---- Create foundations ----
const foundationSuits=["keys","cups","swords","pentacles","major"];
foundationSuits.forEach(suit=>{
    const f=document.createElement("div");
    f.classList.add("foundation");
    f.dataset.suit=suit;
    f.innerHTML=`<strong>${suit.toUpperCase()}</strong>`;
    foundationsDiv.appendChild(f);
});

// ---- Render stock ----
function renderStock(){
    stockDiv.innerHTML="";
    if(stockStack.length===0) return;
    const topCard=stockStack[stockStack.length-1];
    const img=document.createElement("img");
    img.src=backImg;
    img.dataset.front=topCard.img;
    img.dataset.type=topCard.type;
    img.dataset.rank=topCard.rank;
    img.classList.add("card");
    img.addEventListener("click",()=>{
        img.src=img.src.includes(backImg)?img.dataset.front:backImg;
        stockStack.pop();
        renderStock();
    });
    stockDiv.appendChild(img);
}

renderStock();

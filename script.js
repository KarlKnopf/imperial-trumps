// script.js — complete, self-contained
document.addEventListener("DOMContentLoaded", () => {

  // ----------------------
  // Configuration / paths
  // ----------------------
  const backImg = "images/back/card78.png";
  const darkSuits = ["swords", "keys"];
  const lightSuits = ["cups", "pentacles"];

  // ----------------------
  // DOM containers — must exist in your HTML
  // ----------------------
  const stockDiv = document.getElementById("stock");
  const tableauDiv = document.getElementById("tableau");
  const foundationsDiv = document.getElementById("foundations");

  if (!stockDiv || !tableauDiv || !foundationsDiv) {
    console.error("Missing one of required containers: #stock, #tableau, #foundations");
    return;
  }

  // ----------------------
  // Deck builder & shuffle
  // ----------------------
  let deck = [];

  function buildDeck() {
    deck = [];
    // Major 0..21 (Fool=0, Magician=1, etc.)
    for (let i = 0; i <= 21; i++) {
      deck.push({ type: "major", rank: i, img: "images/major/card" + i + ".png" });
    }
    // Keys 22..35 => ranks 1..14 (i-21)
    for (let i = 22; i <= 35; i++) {
      deck.push({ type: "keys", rank: i - 21, img: "images/keys/card" + i + ".png" });
    }
    // Cups 36..49
    for (let i = 36; i <= 49; i++) {
      deck.push({ type: "cups", rank: i - 35, img: "images/cups/card" + i + ".png" });
    }
    // Swords 50..63
    for (let i = 50; i <= 63; i++) {
      deck.push({ type: "swords", rank: i - 49, img: "images/swords/card" + i + ".png" });
    }
    // Pentacles 64..77
    for (let i = 64; i <= 77; i++) {
      deck.push({ type: "pentacles", rank: i - 63, img: "images/pentacles/card" + i + ".png" });
    }
  }

  function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ----------------------
  // Game state containers
  // ----------------------
  const tableauPiles = [];
  let stockStack = [];

  // ----------------------
  // Helpers
  // ----------------------
  function getTopCard(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    return cards[cards.length - 1] || null;
  }

  function isOppositeColor(a, b) {
    return (darkSuits.includes(a) && lightSuits.includes(b)) ||
           (lightSuits.includes(a) && darkSuits.includes(b));
  }

  // ----------------------
  // Drag behavior (single-element move)
  // ----------------------
  function addDragBehavior(img) {
    img.addEventListener("dragstart", (e) => {
      // debug log so you can see type & rank in console
      console.log("dragstart:", img.dataset.type, img.dataset.rank, img.dataset.front);
      img.classList.add("dragging");
      // allow dragging the element itself; dataTransfer required in some browsers
      e.dataTransfer.setData("text/plain", "dragging-card");
    });
    img.addEventListener("dragend", () => {
      img.classList.remove("dragging");
    });
  }

  // ----------------------
  // Fan/layout helper for tableau piles
  // ----------------------
  function fanTableauPile(pileDiv) {
    const cards = pileDiv.querySelectorAll(".card");
    cards.forEach((card, i) => {
      card.style.position = "absolute";
      card.style.left = "0px";
      card.style.top = (i * 28) + "px"; // 28px vertical gap
      card.style.zIndex = i + 1;
      // keep front/back image consistency handled elsewhere
    });
  }

  // ----------------------
  // Render stock (simple top-card view)
  // ----------------------
  function renderStock() {
    stockDiv.innerHTML = "";
    if (!stockStack || stockStack.length === 0) return;

    const top = stockStack[stockStack.length - 1];
    const img = document.createElement("img");
    img.classList.add("card");
    img.draggable = true;
    img.src = backImg;
    img.dataset.front = top.img;
    img.dataset.type = top.type;
    img.dataset.rank = top.rank;
    addDragBehavior(img);

    // clicking flips and removes from stock (simple implementation)
    img.addEventListener("click", () => {
      // reveal then remove from stock
      img.src = img.src === backImg ? img.dataset.front : backImg;
      stockStack.pop();
      renderStock();
    });

    stockDiv.appendChild(img);
  }

  // ----------------------
  // Enable drop logic (tableau & foundation)
  // ----------------------
  function enableDrop(targetDiv) {
    targetDiv.addEventListener("dragover", (e) => e.preventDefault());

    targetDiv.addEventListener("drop", (e) => {
      e.preventDefault();

      const dragging = document.querySelector(".dragging");
      if (!dragging) return;

      const oldParent = dragging.parentElement;
      const movingType = dragging.dataset.type;
      const movingRank = parseInt(dragging.dataset.rank, 10);

      // --- Tableau rules ---
      if (targetDiv.classList.contains("tableau-pile")) {
        const top = getTopCard(targetDiv);
        if (top) {
          const topRank = parseInt(top.dataset.rank, 10);
          const topType = top.dataset.type;
          if (!(isOppositeColor(movingType, topType) && movingRank === topRank - 1)) {
            // illegal
            return;
          }
        } else {
          // empty pile: only King allowed
          if (movingRank !== 14) return;
        }

        // append to tableau (absolute positioning inside pile)
        targetDiv.appendChild(dragging);
        // ensure card is absolute positioned in pile and refan
        dragging.style.position = "absolute";
        dragging.style.left = "0px";
        // fan both piles
        fanTableauPile(targetDiv);
        if (oldParent && oldParent.classList.contains("tableau-pile")) fanTableauPile(oldParent);
        return;
      }

      // --- Foundation rules ---
      if (targetDiv.classList.contains("foundation")) {
        const suit = targetDiv.dataset.suit; // 'major' or suit name
        const top = getTopCard(targetDiv);

        if (suit === "major") {
          // Major arcana special rules:
          // - empty foundation must start with Magician (rank 1)
          // - sequence goes 1,2,...,21, then Fool (0) last
          if (!top) {
            if (movingRank !== 1 || movingType !== "major") return;
          } else {
            const topRank = parseInt(top.dataset.rank, 10);
            // if topRank is 21, next must be Fool (0)
            if (topRank === 21) {
              if (movingRank !== 0 || movingType !== "major") return;
            } else {
              // normal ascending
              if (movingType !== "major" || movingRank !== topRank + 1) return;
            }
          }
        } else {
          // Minor suits: must be same suit and ascending rank starting with 1
          if (!top) {
            if (movingRank !== 1 || movingType !== suit) return;
          } else {
            const topRank = parseInt(top.dataset.rank, 10);
            if (movingType !== suit || movingRank !== topRank + 1) return;
          }
        }

        // inside enableDrop -> when dropping on a foundation
targetDiv.appendChild(dragging);

// reset any old offsets from tableau
dragging.style.left = "0px";
dragging.style.top  = "0px";
dragging.style.position = "absolute";

// now stack it neatly in foundation
const cards = targetDiv.querySelectorAll(".card");
const idx = cards.length - 1;
dragging.style.top  = (idx * 6) + "px";     // small vertical stack
dragging.style.left = "0px";
dragging.style.zIndex = 100 + idx;


        // ensure foundation is relatively positioned (CSS should set this; set again for safety)
        targetDiv.style.position = targetDiv.style.position || "relative";

        // position stacked cards neatly: small vertical offset
        const cards = targetDiv.querySelectorAll(".card");
        const idx = cards.length - 1; // zero-based index of the newly appended card
        dragging.style.position = "absolute";
        dragging.style.left = "0px";
        dragging.style.top = (idx * 6) + "px";
        dragging.style.zIndex = 100 + idx; // foundations on top of table stacks

        // if the old parent was a tableau pile, re-fan it
        if (oldParent && oldParent.classList.contains("tableau-pile")) {
          fanTableauPile(oldParent);
        }
        return;
      }

      // If drop target is neither tableau nor foundation, do nothing
    });
  }

  // ----------------------
  // Build UI: foundations & tableau containers
  // ----------------------
  function setupBoardContainers() {
    // create 7 tableau piles
    tableauDiv.innerHTML = "";
    tableauPiles.length = 0;
    for (let i = 0; i < 7; i++) {
      const pile = document.createElement("div");
      pile.classList.add("tableau-pile");
      pile.style.position = "relative";
      pile.style.display = "inline-block";
      pile.style.width = "120px";
      pile.style.height = "420px";
      pile.style.marginRight = "16px";
      pile.style.verticalAlign = "top";
      pile.style.border = "1px dashed #666";
      tableauDiv.appendChild(pile);
      tableauPiles.push(pile);
      enableDrop(pile);
    }

    // foundations
    foundationsDiv.innerHTML = "";
    const foundationSuits = ["keys", "cups", "swords", "pentacles", "major"];
    for (const s of foundationSuits) {
      const f = document.createElement("div");
      f.classList.add("foundation");
      f.dataset.suit = s;
      f.style.position = "relative";
      f.style.display = "inline-block";
      f.style.width = "120px";
      f.style.height = "160px";
      f.style.marginRight = "12px";
      f.style.border = "2px solid #444";
      // label
      const label = document.createElement("div");
      label.textContent = s.toUpperCase();
      label.style.textAlign = "center";
      label.style.pointerEvents = "none";
      f.appendChild(label);
      foundationsDiv.appendChild(f);
      enableDrop(f);
    }
  }

  // ----------------------
  // Deal tableau from stockStack
  // ----------------------
  function dealFromStockStack() {
    // Clear piles
    tableauPiles.forEach(p => p.innerHTML = "");

    // deal in classic Klondike pattern
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = stockStack.pop();
        if (!card) continue;
        const img = document.createElement("img");
        img.classList.add("card");
        img.draggable = true;
        img.dataset.front = card.img;
        img.dataset.type = card.type;
        img.dataset.rank = card.rank;
        // face-down except bottom card
        img.src = (row === col) ? card.img : backImg;
        addDragBehavior(img);
        tableauPiles[col].appendChild(img);
      }
      fanTableauPile(tableauPiles[col]);
    }

    renderStock();
  }

  // ----------------------
  // Initialize the game
  // ----------------------
  function initGame() {
    buildDeck();
    shuffleArray(deck);
    // clone deck to stockStack (we will pop from stockStack while dealing)
    stockStack = deck.slice(); // copy
    setupBoardContainers();
    dealFromStockStack();
  }

  // run
  initGame();

}); // DOMContentLoaded end

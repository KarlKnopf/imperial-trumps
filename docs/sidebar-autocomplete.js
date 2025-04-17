function waitForSidebarInput(callback, retries = 10) {
  const input = document.querySelector('#sidebarOverlay input[type="text"]');
  if (input) {
    callback(input);
  } else if (retries > 0) {
    setTimeout(() => waitForSidebarInput(callback, retries - 1), 300);
  } else {
    console.warn("⚠️ Sidebar input not found after retries.");
  }
}
const labelSuggestions = [
  { label: "New Galaxy Introductions", url: "/search/label/New%20Galaxy%20Introductions" },
  { label: "Cultural Highlights", url: "/search/label/Cultural%20Highlights" },
  { label: "Interstellar Politics", url: "/search/label/Interstellar%20Politics" },
  { label: "Space Religion & Philosophy", url: "/search/label/Space%20Religion%20%26%20Philosophy" }
];

let postSuggestions = [];
let fetchedPosts = false;

async function fetchPostTitles() {
  try {
    const response = await fetch("https://intergalacticnewsletter.blogspot.com/feeds/posts/default?alt=json");
    const data = await response.json();
    return data.feed.entry.map(entry => ({ label: entry.title.$t }));
  } catch (e) {
    console.warn("Unable to fetch post titles:", e);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  waitForSidebarInput(function(input) {
    console.log("✅ Sidebar input found, initializing autocomplete...");
    console.log("Value of input element:", input);
    // everything inside your current autocomplete logic goes here
    // starting from: const container = document.createElement("div"); ...
  });
});

  const container = document.createElement("div");
  container.style.position = "relative";
  input.parentNode.insertBefore(container, input);
  container.appendChild(input);

  const dropdown = document.createElement("ul");
  Object.assign(dropdown.style, {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: "#000",
    border: "1px solid #b6ff00",
    color: "#b6ff00",
    listStyle: "none",
    padding: "0",
    margin: "4px 0 0 0",
    zIndex: "10002",
    maxHeight: "200px",
    overflowY: "auto",
    display: "none"
  });
  container.appendChild(dropdown);

  let currentFocus = -1;

  function updateHighlight(index) {
    const items = dropdown.querySelectorAll("li");
    items.forEach((item, i) => {
      item.style.backgroundColor = i === index ? "#222" : "transparent";
    });
  }

  input.addEventListener("input", async () => {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = '';
    currentFocus = -1;

    // Fetch post titles lazily
    if (!fetchedPosts) {
      postSuggestions = await fetchPostTitles();
      fetchedPosts = true;
    }

    const allSuggestions = [...labelSuggestions, ...postSuggestions];

    if (!value) {
      dropdown.style.display = "none";
      return;
    }

    const filtered = allSuggestions.filter(s => s.label.toLowerCase().includes(value));
    if (filtered.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    filtered.forEach((s, index) => {
      const item = document.createElement("li");
      const matchIndex = s.label.toLowerCase().indexOf(value);
      const before = s.label.substring(0, matchIndex);
      const match = s.label.substring(matchIndex, matchIndex + value.length);
      const after = s.label.substring(matchIndex + value.length);

      if (s.url) {
        item.innerHTML = `<a href="${s.url}" style="color: #b6ff00; text-decoration: none; display: block; padding: 8px;">
          ${before}<span style="color: #fff; font-weight: bold; text-shadow: 0 0 5px #b6ff00;">${match}</span>${after}
        </a>`;
      } else {
        item.innerHTML = `<span style="display: block; padding: 8px;">
          ${before}<span style="color: #fff; font-weight: bold; text-shadow: 0 0 5px #b6ff00;">${match}</span>${after}
        </span>`;
        item.addEventListener("click", () => {
          input.value = s.label;
          dropdown.style.display = "none";
        });
      }

      item.addEventListener("mouseover", () => updateHighlight(index));
      item.addEventListener("mouseout", () => updateHighlight(-1));
      dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
  });

  input.addEventListener("keydown", (e) => {
    const items = dropdown.querySelectorAll("li");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      currentFocus = (currentFocus + 1) % items.length;
      updateHighlight(currentFocus);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      currentFocus = (currentFocus - 1 + items.length) % items.length;
      updateHighlight(currentFocus);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (currentFocus > -1) {
        const target = items[currentFocus].querySelector("a, span");
        if (target && target.tagName === "A") {
          window.location.href = target.href;
        } else if (target) {
          input.value = target.textContent;
          dropdown.style.display = "none";
        }
      }
    } else if (e.key === "Escape") {
      dropdown.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});

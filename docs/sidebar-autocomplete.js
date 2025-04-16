// Sidebar Autocomplete with Links and Highlights

const labelSuggestions = [
  { label: "New Galaxy Introductions", url: "/2025/04/issue-1.html" },
  { label: "Cultural Highlights", url: "/2025/04/issue-1.html" },
  { label: "Interstellar Politics", url: "/2025/04/issue-2.html" },
  { label: "Space Religion & Philosophy", url: "/2025/04/issue-2.html" }
];

async function fetchPostTitles() {
  try {
    const response = await fetch("https://intergalacticnewsletter.blogspot.com/feeds/posts/default?alt=json");
    const data = await response.json();
    return data.feed.entry.map(entry => ({ label: entry.title.$t }));
  } catch (e) {
    console.warn("Post title fetch failed:", e);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const input = document.querySelector('#sidebarOverlay input[type="text"]');
  if (!input) return;

  const postTitles = await fetchPostTitles();
  const allSuggestions = [...labelSuggestions, ...postTitles];

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
    dropdown.querySelectorAll("li").forEach((li, i) => {
      li.style.backgroundColor = i === index ? "#222" : "transparent";
    });
  }

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    dropdown.innerHTML = "";
    currentFocus = -1;

    if (!value) {
      dropdown.style.display = "none";
      return;
    }

    const filtered = allSuggestions.filter(s => s.label.toLowerCase().includes(value));
    if (!filtered.length) {
      dropdown.style.display = "none";
      return;
    }

    filtered.forEach((s, index) => {
      const li = document.createElement("li");
      const matchIndex = s.label.toLowerCase().indexOf(value);
      const before = s.label.slice(0, matchIndex);
      const match = s.label.slice(matchIndex, matchIndex + value.length);
      const after = s.label.slice(matchIndex + value.length);

      const content = `${before}<span style="color: #fff; font-weight: bold; text-shadow: 0 0 5px #b6ff00;">${match}</span>${after}`;

      if (s.url) {
        li.innerHTML = `<a href="${s.url}" style="color: #b6ff00; text-decoration: none; display: block; padding: 8px;">${content}</a>`;
      } else {
        li.innerHTML = `<span style="display: block; padding: 8px;">${content}</span>`;
        li.addEventListener("click", () => {
          input.value = s.label;
          dropdown.style.display = "none";
        });
      }

      li.addEventListener("mouseover", () => updateHighlight(index));
      li.addEventListener("mouseout", () => updateHighlight(-1));
      dropdown.appendChild(li);
    });

    dropdown.style.display = "block";
  });

  input.addEventListener("keydown", e => {
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
      const selected = items[currentFocus]?.querySelector("a, span");
      if (selected?.tagName === "A") {
        window.location.href = selected.href;
      } else if (selected) {
        input.value = selected.textContent;
        dropdown.style.display = "none";
      }
    } else if (e.key === "Escape") {
      dropdown.style.display = "none";
    }
  });

  document.addEventListener("click", e => {
    if (!container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});

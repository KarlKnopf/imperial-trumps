document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("customSidebar");
  const toggleButton = document.getElementById("sidebarToggle");

  if (!sidebar || !toggleButton) {
    console.warn("Sidebar or toggle button not found.");
    return;
  }

  // Ensure the sidebar starts hidden (offscreen to the right)
  sidebar.style.transform = "translateX(100%)";

  // Open sidebar
  toggleButton.addEventListener("click", () => {
    sidebar.style.transform = "translateX(0)";
  });

  // Add close button to the top of the sidebar
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-btn";
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: inherit;
  `;

  closeBtn.addEventListener("click", () => {
    sidebar.style.transform = "translateX(100%)";
  });

  // Insert close button only once
  if (!sidebar.querySelector(".close-btn")) {
    sidebar.insertBefore(closeBtn, sidebar.firstChild);
  }

  console.log("✅ Sidebar toggle and close logic loaded.");
});


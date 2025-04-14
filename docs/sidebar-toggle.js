document.addEventListener("DOMContentLoaded", function () {
  var toggleBtn = document.getElementById("sidebarToggle");
  var sidebar = document.getElementById("customSidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  } else {
    console.warn("Sidebar or toggle button not found.");
  }
});
<script>
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("customSidebar");
  const toggleButton = document.getElementById("sidebarToggle");

  // Show sidebar
  toggleButton?.addEventListener("click", () => {
    sidebar.style.transform = "translateX(0)";
  });

 <script>
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("customSidebar");
  const toggleButton = document.getElementById("sidebarToggle");

  if (!sidebar || !toggleButton) {
    console.warn("Sidebar or toggle button not found.");
    return;
  }

  // Ensure the sidebar starts hidden
  sidebar.style.transform = "translateX(100%)";

  // Open sidebar
  toggleButton.addEventListener("click", () => {
    sidebar.style.transform = "translateX(0)";
  });

  // Add close button to top of sidebar
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-btn";
  closeBtn.addEventListener("click", () => {
    sidebar.style.transform = "translateX(100%)";
  });

  // Insert close button only once
  if (!sidebar.querySelector(".close-btn")) {
    sidebar.insertBefore(closeBtn, sidebar.firstChild);
  }

  console.log("✅ Sidebar toggle and close logic loaded.");
});
</script>

  console.log("✅ Sidebar script initialized");
});
</script>

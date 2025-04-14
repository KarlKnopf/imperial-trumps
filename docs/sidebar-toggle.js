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

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✖";
  closeBtn.className = "close-btn";
  closeBtn.onclick = () => {
    sidebar.style.transform = "translateX(-100%)";
  };
  sidebar.insertBefore(closeBtn, sidebar.firstChild);

  console.log("✅ Sidebar script initialized");
});
</script>

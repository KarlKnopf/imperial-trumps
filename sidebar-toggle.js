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
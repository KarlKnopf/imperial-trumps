
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebarOverlay");
  const toggleBtn = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("sidebarClose");

  if (!sidebar || !toggleBtn || !closeBtn) {
    console.warn("Sidebar toggle: one or more elements not found.");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    sidebar.style.display = "block";
    setTimeout(() => {
      sidebar.style.opacity = "1";
    }, 10);
  });

  closeBtn.addEventListener("click", () => {
    sidebar.style.opacity = "0";
    setTimeout(() => {
      sidebar.style.display = "none";
    }, 300);
  });
});

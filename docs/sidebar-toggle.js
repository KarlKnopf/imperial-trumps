console.log("Elements at startup:", document.querySelectorAll("#customSidebar, #sidebarToggle"));
function waitForElement(selector, callback, timeout = 10000) {
  const start = Date.now();
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    } else if (Date.now() - start > timeout) {
      clearInterval(interval);
      console.warn("❌ Timeout waiting for", selector);
    }
  }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
  waitForElement("#sidebarToggle", () => {
    waitForElement("#customSidebar", () => {
      const toggleButton = document.getElementById("sidebarToggle");
      const sidebar = document.getElementById("customSidebar");

      // Set sidebar hidden by default
      sidebar.style.transform = "translateX(100%)";

      toggleButton.addEventListener("click", () => {
        sidebar.style.transform = "translateX(0)";
      });

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

      if (!sidebar.querySelector(".close-btn")) {
        sidebar.insertBefore(closeBtn, sidebar.firstChild);
      }

      console.log("✅ Sidebar toggle and close logic fully initialized.");
    });
  });
});
const toggleButton = document.getElementById("sidebarToggleReal");
<script>
  window.onload = function () {
    const sidebar = document.getElementById("sidebarOverlay");
    const toggleBtn = document.getElementById("sidebarToggle");
    const closeBtn = document.getElementById("sidebarClose");

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
  };
</script>

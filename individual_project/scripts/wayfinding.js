//wayfinding
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  
    navLinks.forEach(link => {
      const href = link.getAttribute("href").toLowerCase();
  
      // If current page is empty or index.html, match home
      if ((currentPage === "" || currentPage === "index.html") && (href === "index.html" || href === "")) {
        link.classList.add("active");
      } else if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
});
  
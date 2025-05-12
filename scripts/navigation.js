document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    toggleButton.addEventListener('click', () => {
        navMenu.classList.toggle('show');

        // Change icon text
        const isOpen = navMenu.classList.contains('show');
        toggleButton.textContent = isOpen ? '✖' : '☰';
    });
});

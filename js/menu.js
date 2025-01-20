export function menu() {
    // Menú de navegación
    const menuButton = document.getElementById('menu-button');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const menuOpciones = document.getElementById('menu');

    // Manejo del menú con transición
    menuButton.addEventListener('click', () => {
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');

        if (menuOpciones.classList.contains('hidden')) {
            menuOpciones.classList.remove('hidden');
            setTimeout(() => {
                menuOpciones.classList.remove('opacity-0', 'max-h-0');
                menuOpciones.classList.add('opacity-100', 'max-h-screen');
            }, 100);
        } else {
            menuOpciones.classList.add('opacity-0', 'max-h-0');
            menuOpciones.classList.remove('opacity-100', 'max-h-screen');

            setTimeout(() => {
                if (menuOpciones.classList.contains('opacity-0')) {
                    menuOpciones.classList.add('hidden');
                }
            }, 1000); // Duración de la transición
        }
    });
}
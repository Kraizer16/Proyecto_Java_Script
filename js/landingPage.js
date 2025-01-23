import { menu } from "../js/menu.js"
import { inicioSesionModals } from '../js/inicioSesion.js'

function initializeSlider(sliderId, nextButtonId, prevButtonId, autoInterval = null) {
    let currentSlideId = 0;
    const sliderElement = document.getElementById(sliderId);
    const go = document.getElementById(nextButtonId);
    const wait = document.getElementById(prevButtonId);
    const totalSlides = sliderElement.childElementCount;
    let autoSlideInterval;
    let userInteractionTimeout;

    // Función común para mostrar una diapositiva
    function showSlide(index) {
        const slides = sliderElement.getElementsByTagName('li');
        for (let i = 0; i < totalSlides; i++) {
            const element = slides[i];
            if (i === index) {
                element.classList.add("active");
                element.classList.remove("hidden");

                // Retrasar la aparición del texto
                const textContainer = element.querySelector('.text-container');
                if (textContainer) {
                    textContainer.style.opacity = "0"; // Oculta inicialmente
                    setTimeout(() => {
                        textContainer.style.opacity = "1"; // Muestra después de un retraso
                    }, 300); // 300ms de retraso
                }
            } else {
                element.classList.remove("active");
                element.classList.add("hidden");
            }
        }
    }

    // Función para avanzar al siguiente slide
    function next() {
        currentSlideId = (currentSlideId + 1) % totalSlides;
        showSlide(currentSlideId);
    }

    // Función para retroceder al slide anterior
    function prev() {
        currentSlideId = (currentSlideId - 1 + totalSlides) % totalSlides;
        showSlide(currentSlideId);
    }

    // Pausar el auto-slider y reiniciarlo después de 5 segundos
    function handleUserInteraction() {
        clearInterval(autoSlideInterval); // Pausa el auto-slider
        clearTimeout(userInteractionTimeout); // Limpia cualquier temporizador previo

        // Reinicia el auto-slider después de 5 segundos
        userInteractionTimeout = setTimeout(() => {
            startAutoSlider();
        }, 5000);
    }

    // Inicia el auto-slider
    function startAutoSlider() {
        if (autoInterval) {
            autoSlideInterval = setInterval(() => {
                next();
            }, autoInterval);
        }
    }

    // Configurar control manual
    if (go && wait) {
        go.addEventListener("click", () => {
            handleUserInteraction(); // Maneja interacción del usuario
            next();
        });
                
        wait.addEventListener("click", () => {
            handleUserInteraction(); // Maneja interacción del usuario
            prev();
        });
    }
            
    // Inicializar el slider
    startAutoSlider(); // Inicia el auto-slider si se proporciona un intervalo
    showSlide(currentSlideId); // Muestra el primer slide al cargar
}

// Inicializar slider con control manual y auto-slider con reinicio después de 5 segundos
initializeSlider('slider', 'adelante', 'atras', 3000);


// Galeria
function modales_galeria() {
    const modales = document.getElementById('Galeria').getElementsByTagName('li');
    const modal = document.getElementById('modal_galeria');
    const contenedor = document.getElementById('contenedor_modales');
    const cuerpo = document.getElementById('b');

    for (const element of modales) {
        element.addEventListener('click', (e) => {
            const elementCloned = element.cloneNode(true);
            const clonedImg = elementCloned.querySelector('img');
            const clonedBton = elementCloned.querySelector('button');

            // Si el clic no fue en la imagen
            if (e.target !== clonedImg) {
                modal.classList.remove('hidden');
                contenedor.classList.remove('hidden');
                clonedBton.classList.remove('hidden');
                cuerpo.classList.add('overflow-y-hidden');

                    
                // Clonar el elemento li y modificar las clases del li
                elementCloned.classList.remove('h-96');
                elementCloned.classList.add('m-0', 'p-2', "h-64");

                // Eliminar las clases no deseadas de la imagen
                if (clonedImg) {
                    clonedImg.classList.remove('my-9', 'px-5');
                    clonedImg.classList.add('sm:h-[45vh]');
                }

                modal.appendChild(elementCloned);

                // Cerrar el modal al hacer clic fuera de la imagen o en el botón de cierre
                contenedor.addEventListener('click', (e) => {
                    
                    // Verificar si el clic fue dentro del botón de cierre o fuera del modal
                    if (e.target.closest('button') === clonedBton || !modal.contains(e.target)) {
                        modal.classList.add('hidden');
                        contenedor.classList.add('hidden');
                        cuerpo.classList.remove('overflow-y-hidden');

                        modal.innerHTML = '';
                    }
                });

            }
        });
    }

}


modales_galeria();
menu();
inicioSesionModals();



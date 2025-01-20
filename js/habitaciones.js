import { inicioSesionModals } from './inicioSesion.js'
import { menu } from "./menu.js"

function dibujarHabitaciones(habitaciones) {
    let contenedor = document.getElementById("contenedor_habitaciones");
    let jiji = "";
    for (const habitacion of habitaciones) {
        jiji += `
                <div class="bg-white rounded overflow-hidden">
                    <img src="${habitacion.imagen}" alt="Blog Post 3" class="w-full h-52 object-cover" />
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-3">${habitacion.nombre}</h3>
                        <p class="text-gray-500 text-sm">${habitacion.descripcion}</p>
                        <p class="text-orange-500 text-[13px] font-semibold mt-4">Wifi: ${habitacion.wifi}</p>
                        <p class="text-orange-500 text-[13px] font-semibold mt-2">Max Personas: ${habitacion.max_personas}</p>
                        <p class="text-orange-500 text-[13px] font-semibold mt-2">Disponible: ${habitacion.disponible}</p>
                        <p class="text-green-500 text-[13px] font-semibold mt-2 mb-4">Precio: ${habitacion.precio}</p>
        
                        <!-- Botón de Reservar con Tailwind -->
                        <a class="btn-reservar mt-4 inline-block px-4 py-2 rounded tracking-wider bg-orange-500 hover:bg-orange-600 text-white text-[13px] mx-auto cursor-pointer"
                            data-nombre="${habitacion.nombre}"
                            data-descripcion="${habitacion.descripcion}"
                            data-wifi="${habitacion.wifi}"
                            data-max-personas="${habitacion.max_personas}"
                            data-disponible="${habitacion.disponible}"
                            data-precio="${habitacion.precio}"
                            imagen="${habitacion.imagen}"
                            nameReserver="${habitacion.userReserva}"
                            id="${habitacion.id}">
                            Reservar
                        </a>

                        <!-- Botón de Cancelar Reserva con Tailwind -->
                        <a class="btn-cancelar hidden mt-2 inline-block px-4 py-2 rounded tracking-wider bg-red-500 hover:bg-red-600 text-white text-[13px] mx-auto cursor-pointer"
                            data-nombre="${habitacion.nombre}"
                            data-descripcion="${habitacion.descripcion}"
                            data-wifi="${habitacion.wifi}"
                            data-max-personas="${habitacion.max_personas}"
                            data-disponible="${habitacion.disponible}"
                            data-precio="${habitacion.precio}"
                            imagen="${habitacion.imagen}"
                            nameReserver="${habitacion.userReserva}"
                            id="${habitacion.id}">
                            Cancelar Reserva
                        </a>
                    </div>
                </div>`;
    }
    contenedor.innerHTML = jiji;
}

// Código para cargar habitaciones

if (window.location.pathname.includes("habitaciones.html")) {

    mostrarDisponibilidad()
    mostrarHabitaciones();
    reservas()
    menu();
}
function mostrarHabitaciones() {
    fetch('http://localhost:3000/habitaciones')
        .then(response => response.json())
        .then(data => {
            dibujarHabitaciones(data);
            inicioSesionModals();
        })
        .catch((error) => console.error('error en cargar:', error.message))
        .finally(() => console.log('Petición finalizada'));
}

function reservas() {
    const fechaStart = document.getElementById("fechaStart");
    const fechaEnd = document.getElementById("fechaEnd");
    const fechaStartReserva = document.getElementById("fechaStartReserva");
    const fechaEndReserva = document.getElementById("fechaEndReserva");

    if (!fechaStart || !fechaEnd) {
        // Si no existen los elementos, salir de la función
        console.warn("Algunos elementos necesarios para 'reservas' no están presentes.");
        return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const tomorrow = mañana.toISOString().split("T")[0];

    // Asignar valores mínimos iniciales para todas las fechas
    [fechaStart, fechaStartReserva].forEach((campo) => campo.setAttribute("min", hoy));
    [fechaEnd, fechaEndReserva].forEach((campo) => campo.setAttribute("min", tomorrow));

    // Agregar eventos para manejar cambios en fechaStart y fechaStartReserva
    [fechaStart, fechaStartReserva].forEach((campo, index) => {
        const correspondingEnd = index === 0 ? fechaEnd : fechaEndReserva;

        campo.addEventListener("change", function () {
            const nuevaFechaEnd = new Date(this.value);
            if (nuevaFechaEnd) {
                nuevaFechaEnd.setDate(nuevaFechaEnd.getDate() + 1);
                correspondingEnd.setAttribute("min", nuevaFechaEnd.toISOString().split("T")[0]);
            }
        });
    });
}

function mostrarDisponibilidad() {
    const formDiponbl = document.getElementById("form-reserva");

    if (!formDiponbl) {
        console.warn("El formulario 'form-reserva' no está presente en el DOM.");
        return; // Salir si no se encuentra el formulario
    }

    formDiponbl.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario.

        // Obtener valores del formulario
        const maxPersonas = parseInt(document.getElementById("max-personas")?.value || "0");
        const fechaInicio = document.getElementById("fechaStart")?.value || "";
        const fechaFin = document.getElementById("fechaEnd")?.value || "";

        try {
            // Realizar la solicitud para obtener las habitaciones
            const response = await fetch("http://localhost:3000/habitaciones");
            if (!response.ok) {
                throw new Error("Error al obtener las habitaciones");
            }
            const habitaciones = await response.json();

            // Filtrar habitaciones disponibles
            const habitacionesdisp = habitaciones.filter((habitacion) => {
                return habitacion.max_personas >= maxPersonas;
            });

            const letter = document.getElementById("letrero");

            if (habitacionesdisp.length > 0) {
                letter.innerHTML = "";
                const encabezado = `
                    <div class="text-3xl font-extrabold text-gray-800 mb-4 mt-8 text-center">
                        <h2 class="text-2xl font-bold text-gray-800">
                            Habitaciones disponibles: ${habitacionesdisp.length}
                        </h2>
                        <p class="text-gray-600 text-sm">
                            Basado en los criterios seleccionados (${maxPersonas} personas, desde ${fechaInicio} hasta ${fechaFin}).
                        </p>
                    </div>
                `;
                letter.innerHTML = encabezado;
                dibujarHabitaciones(habitacionesdisp); // Mostrar habitaciones

                // Vuelve a asignar los eventos de los botones
                setupReservaModal();
            } else {
                // Mostrar mensaje de no disponibilidad
                letter.innerHTML = `
                    <div class="mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">
                            No hay habitaciones disponibles.
                        </h2>
                        <p class="text-gray-600 text-sm">
                            Basado en los criterios seleccionados (${maxPersonas} personas, desde ${fechaInicio} hasta ${fechaFin}).
                        </p>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Error al buscar habitaciones disponibles:", error);
            alert("Hubo un error al buscar las habitaciones. Intenta nuevamente.");
        }
    });
}

export default function setupReservaModal() {
    // Obtener todos los botones de reserva
    const btnsReservar = document.getElementsByClassName('btn-reservar');
    const btnsCancelar = document.getElementsByClassName('btn-cancelar');
    const modal = document.getElementById('modalReserva');
    const closeModal = document.getElementById('closeModal');
    const formReserva = document.getElementById("formReserva"); // Suponiendo que tienes un formulario de reserva
    const usu = sessionStorage.getItem("usuario_activo")

    // Función para abrir el modal con la información de la habitación
    for (const btn of btnsReservar) {
        if (usu) {
            btn.addEventListener("click", function () {
                // Obtener la información de la habitación desde los atributos del botón o contenedor
                const habitacion = {
                    nombre: btn.getAttribute("data-nombre"),
                    descripcion: btn.getAttribute("data-descripcion"),
                    wifi: btn.getAttribute("data-wifi"),
                    maxPersonas: btn.getAttribute("data-max-personas"),
                    disponible: btn.getAttribute("data-disponible"),
                    precio: btn.getAttribute("data-precio"),
                    id: btn.getAttribute("id"),
                    imagen: btn.getAttribute("imagen"),
                    usuarioReserva: btn.getAttribute("nameReserver") // Asegúrate de tener este dato para verificar si está reservada
                };

                // Llenar el modal con la información de la habitación
                document.getElementById('habitacionNombre').textContent = habitacion.nombre;
                document.getElementById('habitacionDescripcion').textContent = habitacion.descripcion;
                document.getElementById('habitacionWifi').textContent = `Wifi: ${habitacion.wifi}`;
                document.getElementById('habitacionMaxPersonas').textContent = `Max Personas: ${habitacion.maxPersonas}`;
                document.getElementById('habitacionDisponible').textContent = `Disponible: ${habitacion.disponible}`;
                document.getElementById('habitacionPrecio').textContent = `Precio: ${habitacion.precio}`;

                const sw = habitacion.disponible
                if (sw === "true") {
                    // Mostrar el modal
                    modal.classList.remove('hidden');

                    // Al hacer clic en el botón de enviar del formulario de reserva
                    formReserva.addEventListener("submit", (event) => {
                        event.preventDefault(); // Prevenir el envío por defecto del formulario

                        // Obtener los valores actualizados desde el modal
                        const nombre = document.getElementById("habitacionNombre").textContent;
                        const descripcion = document.getElementById("habitacionDescripcion").textContent;
                        const precio = document.getElementById("habitacionPrecio").textContent.replace('Precio: ', '');
                        const wifi = document.getElementById("habitacionWifi").textContent.replace('Wifi: ', '');
                        const max_personas = document.getElementById("habitacionMaxPersonas").textContent.replace('Max Personas: ', '');
                        const disponible = document.getElementById("habitacionDisponible").textContent.replace('Disponible: ', '');
                        const id = habitacion.id; // Usar el id de la habitación
                        const imagen = habitacion.imagen

                        // Si se está actualizando la disponibilidad, la convertimos a booleano
                        const disponibleBool = disponible.toLowerCase() === "sí" ? true : false;

                        // Verificar que las fechas están correctas (se pueden agregar más validaciones si es necesario)
                        const fechaStartReserva = document.getElementById("fechaStartReserva").value;
                        const fechaEndReserva = document.getElementById("fechaEndReserva").value;

                        // Verificar que las fechas no estén vacías
                        if (!fechaStartReserva || !fechaEndReserva) {
                            alert("Por favor, selecciona las fechas de inicio y fin.");
                            return;
                        }

                        // Crear el objeto con los datos a actualizar
                        const datosActualizados = {
                            nombre: nombre,
                            descripcion: descripcion,
                            imagen: imagen,
                            precio: precio,
                            wifi: wifi,
                            max_personas: max_personas,
                            disponible: disponibleBool,
                            fechaInicio: fechaStartReserva,
                            fechaFin: fechaEndReserva,
                            userReserva: sessionStorage.getItem("usuario_activo"), // Obtener el usuario activo desde sessionStorage
                            id: id
                        };

                        // Realizar la solicitud PUT para actualizar la habitación
                        fetch(`http://localhost:3000/habitaciones/${id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(datosActualizados)
                        })
                            .then((respuesta) => respuesta.json())
                            .then((datos) => {
                                console.log("Reserva confirmada", datos);
                                alert("Reserva confirmada correctamente.");
                                modal.classList.add('hidden'); // Cerrar el modal después de la confirmación
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                                alert("Hubo un error al realizar la reserva. Intenta nuevamente.");
                            });
                    });

                } else {

                    btn.textContent = "No disponible"

                }


            });
        }

    }


    for (const btnC of btnsCancelar) {
        // Obtener los datos de la habitación desde los atributos del botón

        const habitacion = {
            nombre: btnC.getAttribute("data-nombre"),
            descripcion: btnC.getAttribute("data-descripcion"),
            wifi: btnC.getAttribute("data-wifi"),
            maxPersonas: btnC.getAttribute("data-max-personas"),
            disponible: btnC.getAttribute("data-disponible"),
            precio: btnC.getAttribute("data-precio"),
            id: btnC.getAttribute("id"),
            imagen: btnC.getAttribute("imagen"),
            usuarioReserva: btnC.getAttribute("nameReserver") // Asegúrate de usar este atributo en el HTML
        };

        // Comprobar si el usuario actual es el que hizo la reserva
        if (usu === habitacion.usuarioReserva) {
            // Quitar la clase "hidden" para mostrar el botón
            btnC.classList.remove("hidden");

            // Agregar un evento de clic al botón de cancelar
            btnC.addEventListener("click", () => {
                const datosActualizadosCancelar = {
                    nombre: habitacion.nombre,
                    descripcion: habitacion.descripcion,
                    imagen: habitacion.imagen,
                    precio: habitacion.precio,
                    wifi: habitacion.wifi,
                    max_personas: habitacion.maxPersonas,
                    disponible: true,
                    fechaInicio: null,
                    fechaFin: null,
                    userReserva: null,
                    id: habitacion.id
                }
                // Lógica para cancelar la reserva
                console.log(`Cancelando reserva de la habitación: ${habitacion.nombre}`);
                fetch(`http://localhost:3000/habitaciones/${habitacion.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datosActualizadosCancelar)
                })
                    .then((respuesta) => respuesta.json())
                    .then((datos) => {
                        console.log("Reserva cancelada:", datos);
                        alert("Reserva cancelada correctamente.");
                        // Opcional: Recargar la página o actualizar dinámicamente la interfaz
                        location.reload();
                    })
                    .catch((error) => {
                        console.error("Error al cancelar la reserva:", error);
                        alert("Hubo un error al cancelar la reserva. Intenta nuevamente.");
                    });
            });
        }
    }

    // Cerrar el modal cuando el usuario haga clic en el botón de cierre
    closeModal.addEventListener('click', function () {
        modal.classList.add('hidden');
    });
}






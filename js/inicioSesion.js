import setupModal from "../js/habitaciones.js"
export function inicioSesionModals() {
    const cerrar = document.getElementById('btn-cerrar');
    const iniciar = document.getElementById('btn-iniciar');
    const btns_Reservar = document.getElementsByClassName('btn-reservar');
    const modal = document.getElementById('modal_inicioSesion');
    const contenedor = document.getElementById('contenedor_modal');
    const cuerpo = document.getElementById('b');
    const formu = document.getElementById('formulario');
    const contenedor2 = document.getElementById("contenedor_modal2")
    const formu2 = document.getElementById("formulario2")
    const modal2 = document.getElementById("modal_Registrate")
    const btn_registro = document.getElementById('registro') 
    const btn_iniciar = document.getElementById("iniciar")


    function setupUserInterface() {
        const usuario = sessionStorage.getItem('usuario_activo');
        if (usuario) {
            cerrar.classList.remove('hidden');
            iniciar.classList.add('hidden');
            cerrar.addEventListener("click", () => {

                cerrar.textContent = "cerrando sesion..."
            
                setTimeout(() => {
                    // Acción de cerrar sesión
                    sessionStorage.clear();
                    cerrar.classList.add("hidden");
                    iniciar.classList.remove("hidden");
                    location.reload()

            
                }, 3000)

            });
        }
    }


    function setupSignInModal() {
        const usuario1 = sessionStorage.getItem('usuario_activo'); // Verificar si hay una sesión activa
        if (usuario1) {
            setupModal();
        } else {
            for (const btn of btns_Reservar) {
                btn.addEventListener("click", () => {

                    handleReserveButtonClick()
                    
                });
            }

        }

        iniciar.addEventListener("click", () => {
            handleReserveButtonClick(); // Abrir modal si el usuario presiona "iniciar sesión"
        });
    }

    function setupSignUpModal(){
        btn_registro.addEventListener("click", () =>{
            modal2.classList.remove('hidden');
            contenedor2.classList.remove('hidden');
            cuerpo.classList.add('overflow-y-hidden');
            contenedor2.addEventListener('click', (event) => {
                if (!modal2.contains(event.target)) {
                    closeModal();
                }
            });
        })
    }

    function signnnn() {
        btn_iniciar.addEventListener("click", () => {
            closeModal(); // Cerrar cualquier modal abierto
            handleReserveButtonClick(); // Abrir el modal de inicio de sesión
        });
    }

    function handleReserveButtonClick() {
        modal.classList.remove('hidden');
        contenedor.classList.remove('hidden');
        cuerpo.classList.add('overflow-y-hidden');
        contenedor.addEventListener('click', (event) => {
            if (!modal.contains(event.target)) {
                closeModal();
            }
        });
        setupUserInterface();
    }

    function closeModal() {
        modal.classList.add('hidden');
        contenedor.classList.add('hidden');
        cuerpo.classList.remove('overflow-y-hidden');
        modal2.classList.add('hidden');
        contenedor2.classList.add('hidden');
        cuerpo.classList.remove('overflow-y-hidden');
    }

    async function iniciarSesion() {
        formu.addEventListener("submit", async (event) => {
            event.preventDefault();
    
            // Obtener los datos ingresados por el usuario
            const correo = document.getElementById("email").value.trim();
            const password = document.getElementById("contrasena").value;
    
            try {
                // Cargar los datos del JSON (puedes usar una ruta relativa o API)
                const response = await fetch("https://apiproject-1c5o.onrender.com/users"); // Cambia por la URL de tu archivo JSON
                const usuarios = await response.json();
    
                // Buscar si el usuario y la contraseña coinciden
                const usuarioValido = usuarios.find(user => user.email === correo && user.password === password);
    
                if (usuarioValido) {
                    // Si el usuario es válido, iniciar sesión
                    sessionStorage.setItem('usuario_activo', correo);
                    sessionStorage.setItem('contraseña', password);
    
                    alert("Inicio de sesión exitoso.");
                    setupUserInterface(); // Actualizar la interfaz del usuario
                    closeModal();  // Cerrar el modal de inicio de sesión
                    location.reload()
                } else {
                    // Si no coinciden, mostrar un mensaje de error
                    alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
                }
            } catch (error) {
                // Manejo de errores al cargar o procesar el JSON
                console.error("Error al validar los datos del JSON:", error);
                alert("Hubo un error al intentar iniciar sesión. Por favor, intenta más tarde.");
            }
        });
    }

    async function post (datos) {
        const respuesta = await fetch('https://apiproject-1c5o.onrender.com/users', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(datos),
        });
        return respuesta.json();
    }

    function enviarDatos (){
        formu2.addEventListener("submit", (event) => {
            event.preventDefault();
            const nameSignUp = document.getElementById('name').value
            const emailSignUp = document.getElementById('email_registro').value
            const passwordSignUp = document.getElementById('contrasena_registro').value


            let data = {
                "name": nameSignUp,
                "email": emailSignUp,
                "password": passwordSignUp
            }

            post(data)
            location.reload()
        })

    }


    setupUserInterface();
    setupSignInModal();
    setupSignUpModal();
    signnnn();
    enviarDatos();
    iniciarSesion();
}
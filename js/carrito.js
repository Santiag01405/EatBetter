// Variables para mostrar/ocultar carrito
const carritoIcon = document.querySelector('.carrito img');
const carritoDiv = document.querySelector('#carrito');
let carritoVisible = false;

// Variables para funcionalidad del carrito
const listaPlatos = document.querySelector('.menu-container');
const contenedorCarrito = document.querySelector('#carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const ordenarCarritoBtn = document.querySelector('#ordenar-carrito');
let articulosCarrito = [];

// Establecer el carrito como oculto inicialmente
carritoDiv.style.display = 'none';

// Event Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Mostrar/ocultar carrito
    carritoIcon.addEventListener('click', toggleCarrito);

    // Evitar que el carrito se cierre al hacer clic dentro
    carritoDiv.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Agregar plato al carrito
    listaPlatos.addEventListener('click', agregarPlato);

    // Eliminar plato del carrito
    carritoDiv.addEventListener('click', eliminarPlato);

    // Vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
        sincronizarStorage();
    });

    // Ordenar carrito
    ordenarCarritoBtn.addEventListener('click', () => {
        if(articulosCarrito.length > 0) {
            // Convertir los datos del carrito a una cadena JSON y codificarla en la URL
            const carritoData = encodeURIComponent(JSON.stringify(articulosCarrito));
            window.location.href = `../html/pago.html?carrito=${carritoData}`;
        } else {
            alert('El carrito está vacío. Agrega algunos platillos primero.');
        }
    });

    // Cargar carrito del localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}

// Función para mostrar/ocultar carrito
function toggleCarrito(e) {
    e.preventDefault();
    if (!carritoVisible) {
        carritoDiv.style.display = 'block';
        carritoVisible = true;
    } else {
        carritoDiv.style.display = 'none';
        carritoVisible = false;
    }
}

// Función para agregar plato
function agregarPlato(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const platoSeleccionado = e.target.parentElement.parentElement;
        leerDatosPlato(platoSeleccionado);
    }
}

// Leer datos del plato
function leerDatosPlato(plato) {
    const infoPlato = {
        imagen: plato.querySelector('img').src,
        titulo: plato.querySelector('h3').textContent.split(' - ')[0],
        precio: parseFloat(plato.querySelector('h3').textContent.split(' - ')[1].replace('$', '')),
        id: plato.querySelector('.agregar-carrito').getAttribute('data-id'),
        cantidad: 1
    }

    console.log(infoPlato); // Verificar los datos del plato

    // Revisar si el plato ya existe en el carrito
    const existe = articulosCarrito.some(plato => plato.id === infoPlato.id);
    
    if(existe) {
        articulosCarrito = articulosCarrito.map(plato => {
            if(plato.id === infoPlato.id) {
                plato.cantidad++;
                return plato;
            } else {
                return plato;
            }
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoPlato];
    }

    carritoHTML();
}

// Eliminar plato
function eliminarPlato(e) {
    if(e.target.classList.contains('borrar-plato')) {
        const platoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(plato => plato.id !== platoId);
        carritoHTML();
    }
}

// Mostrar carrito en el HTML
function carritoHTML() {
    limpiarHTML();

    articulosCarrito.forEach(plato => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${plato.imagen}" width="50">
            </td>
            <td>${plato.titulo}</td>
            <td>${plato.precio.toFixed(2)}</td>
            <td>${plato.cantidad}</td>
            <td>
                <a href="#" class="borrar-plato" data-id="${plato.id}">X</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();
}

// Limpiar HTML
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Sincronizar con localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

let cursos = [];

// Check if URL has reset=true to clear carrito and reset UI
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reset = urlParams.get('reset');
    if (reset === 'true') {
        // carrito is now managed in carrito.js, so just call render functions
        renderCursos();
        renderCarrito();
        // Clear the enableVerCurso flag after enabling the button once
        setTimeout(() => {
            localStorage.removeItem('enableVerCurso');
        }, 100);
    }
});

// Generar Cursos en el DOM
const courseList = document.getElementById('course-list');

const fetchCursos = async () => {
    try {
        const response = await fetch('https://cursosdisponibles-equipo4.onrender.com/api/courses');
        cursos = await response.json();
        renderCursos();
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

const renderCursos = () => {
    courseList.innerHTML = '';
    const paidCourseIds = JSON.parse(localStorage.getItem('paidCourseIds')) || [];
    cursos.forEach(curso => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        const cursoIdStr = curso._id.toString();
        // carrito is now managed in carrito.js
        const isInCart = carrito.find(c => c._id.toString() === cursoIdStr);
        const enableVerCurso = paidCourseIds.includes(cursoIdStr);
        courseCard.innerHTML = `
            <img src="${curso.imagen}" alt="${curso.nombre}" width="200" height="150">
            <div class="info">
                <h3>${curso.nombre}</h3>
                <p>${curso.descripcion}</p>
                <p>$${curso.precio}</p>
        <button onclick="agregarAlCarrito('${cursoIdStr}')" ${isInCart ? 'disabled' : ''}>
            ${isInCart ? 'Añadido' : 'Comprar'}
        </button>
        <button id="verCursoBtn" onclick="window.location.href='https://cursosdisponibles-equipo4.onrender.com/videos.html?id=${cursoIdStr}'" ${enableVerCurso ? '' : 'disabled'}>
            Ver Curso
        </button>
    </div>
        `;
        courseList.appendChild(courseCard);
    });
};

fetchCursos();

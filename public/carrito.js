let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Calcular total del carrito
const calcularTotal = () => {
    return carrito.reduce((total, curso) => total + curso.precio, 0);
};

// Manejo del Carrito
const renderCarrito = () => {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    carrito.forEach(curso => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${curso.nombre} - $${curso.precio} 
            <button class="delete-btn" onclick="eliminarDelCarrito('${curso._id.toString()}')">Eliminar</button>
        `;
        cartItems.appendChild(li);
    });
    document.getElementById('cart-count').textContent = carrito.length;

    // Actualizar total en el botón del carrito
    const total = calcularTotal();
    const cartTotalSpan = document.getElementById('cart-total');
    if (cartTotalSpan) {
        if (total > 0) {
            cartTotalSpan.textContent = `Total: $${total}`;
            cartTotalSpan.style.display = 'inline-block';
        } else {
            cartTotalSpan.textContent = '';
            cartTotalSpan.style.display = 'none';
        }
    }
};

const agregarAlCarrito = (id) => {
    const curso = cursos.find(curso => curso._id.toString() === id);
    if (!carrito.find(c => c._id.toString() === id)) {
        carrito.push(curso);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCursos();
        renderCarrito();
        showCartIcon(curso.imagen);
    }
};

const eliminarDelCarrito = (id) => {
    carrito = carrito.filter(curso => curso._id.toString() !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCursos();
    renderCarrito();
};

renderCarrito();

// Ventana flotante del carrito
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentForm = document.getElementById('payment-form');

cartBtn.addEventListener('click', () => {
    cartModal.classList.toggle('hidden');
});

// Mostrar icono pequeño del curso al agregar al carrito
const showCartIcon = (imgSrc) => {
    const cartIcon = document.querySelector('.cart-icon');
    const iconImg = document.createElement('img');
    iconImg.src = imgSrc;
    iconImg.alt = "Curso agregado";
    iconImg.classList.add('small-cart-icon');
    cartIcon.appendChild(iconImg);
    setTimeout(() => {
        iconImg.remove();
    }, 2000);
};

// Mostrar formulario al hacer click en "Comprar"
checkoutBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        // Create centered alert div
        const alertDiv = document.createElement('div');
        alertDiv.textContent = 'El carrito está vacío.';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '20px 40px';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.zIndex = '2000';
        alertDiv.style.fontSize = '1.2rem';
        alertDiv.style.textAlign = 'center';
        document.body.appendChild(alertDiv);

        // Remove alert after 2.5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 2500);

        return;
    }
    // Ocultar lista de items y botón comprar
    document.getElementById('cart-items').classList.add('hidden');
    checkoutBtn.classList.add('hidden');

    // Mostrar formulario
    paymentForm.classList.remove('hidden');

    // Mostrar IDs de cursos como array separado por coma
    const courseIds = carrito.map(curso => curso._id).join(', ');
    document.getElementById('course-id').value = `[${courseIds}]`;

    // Si solo hay un curso, mostrar su nombre en plan, sino texto genérico
    if (carrito.length === 1) {
        document.getElementById('plan').value = carrito[0].nombre;
    } else {
        document.getElementById('plan').value = 'Múltiples planes';
    }
    // Show valor total with $ symbol
    document.getElementById('valor-total').value = '$' + calcularTotal();

    // Deshabilitar botón del carrito
    cartBtn.disabled = true;
    // Deshabilitar botón de comprar en el carrito
    checkoutBtn.disabled = true;
});

// Manejar envío del formulario
paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recopilar datos del formulario
    const valorStr = document.getElementById('valor-total').value;
    // Remove $ symbol before parsing
    const valor = parseFloat(valorStr.replace('$', ''));
    console.log('Valor total a pagar:', valor);

    const formData = {
        courseIds: carrito.map(curso => curso._id),
        documento: document.getElementById('documento').value,
        correo: document.getElementById('correo').value,
        nombre: document.getElementById('nombre').value,
        plan: document.getElementById('plan').value,
        valor: valor
    };

    try {
        // Enviar datos al servidor de la pasarela de pago
        const response = await fetch('https://bancopasarela-equipo2.onrender.com/api/pagar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor de pago');
        }

        const responseData = await response.json();

        // Check if paymentStatusId exists to confirm payment success
        if (responseData.paymentStatusId) {
            // Store paid course IDs in localStorage for enabling "Ver Curso" button on index.html
            const newPaidCourseIds = carrito.map(curso => curso._id.toString());
            const existingPaidCourseIds = JSON.parse(localStorage.getItem('paidCourseIds')) || [];
            const mergedPaidCourseIds = Array.from(new Set([...existingPaidCourseIds, ...newPaidCourseIds]));
            localStorage.setItem('paidCourseIds', JSON.stringify(mergedPaidCourseIds));

            // Clear carrito and localStorage before redirecting
            carrito = [];
            localStorage.removeItem('carrito');
            renderCarrito();

            // Redirect to banco_pasarela payment page after successful payment request
            window.location.href = 'https://bancopasarela-equipo2.onrender.com/';
        } else {
            alert('El pago no fue aprobado. Intente nuevamente.');
        }
    } catch (error) {
        alert('Error al enviar los datos de pago: ' + error.message);
    }
});

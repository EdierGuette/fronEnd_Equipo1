# Cloud Project - E-commerce de Cursos de Programación

## Descripción
Proyecto simple de e-commerce para cursos de programación con backend en Node.js y frontend en HTML, CSS y JavaScript.

## Requisitos
- Node.js instalado
- npm instalado

## Instalación
1. Clonar el repositorio o descargar el proyecto.
2. Ejecutar en la terminal:
   ```
   npm install
   ```

## Uso
Para iniciar el servidor, ejecutar:
```
npm start
```
Luego abrir en el navegador:
```
http://localhost:3000
```

## Funcionalidades
- Visualización de cursos disponibles.
- Agregar cursos al carrito de compras.
- Visualización y gestión del carrito.
- Redirección a PayU para checkout (simulado).

## Estructura
- `server.js`: Servidor backend con Express.
- `public/`: Archivos estáticos frontend (HTML, CSS, JS, imágenes).
- `package.json`: Dependencias y scripts.

## Notas
- Asegúrese de que las imágenes estén en la carpeta `public/images`.
- El carrito se guarda en `localStorage` del navegador.

# resizeImagesNode

# Descripción y comentarios del Proyecto

Proyecto que intenta resolver el escalado en resolucion a partir de una imagen original, tiene una conexión al sevicio de cola SQS para almacenar todas las tareas, esta misma cola es un gatillador de una lambda (ruta raiz: lambdaFn.ts) que intenta hacer el reescalado.

Honestamente, no logre escribir los archivos verionado a una cartpera /output de mi proyecto, por eso tuve que escribir en un bucket S3, hay muchos punto de mejora en esta solución, por enumerar algunas:

- El metodo de configuración de credenciales del aws-sdk
- Manejar base64 para economizar la ida a disco.
- Poder crear un service que separe la logica y supla a los controladores
- La lambda actualmente esta creada en mi cuenta aws, podría bajarla al proyecto a través del sdk.
- Agregar class-validatos-
- Agregar handler error
- Dockerizar la app (Opcional)
- Tipar las salidas de los controller y metodos
- Implementar code guidelines (husky, commandLint, ESlint, prettier, etc)

## Arquitectura y Solución

El proyecto sigue una arquitectura de tres capas, utilizando Node.js y Express para el backend. La estructura del proyecto se organiza de la siguiente manera:

controllers/ -> Controladores que manejan las solicitudes HTTP
models/ -> Definición de los modelos de datos
routes/ -> Configuración de las rutas y endpoints
utils/ -> Utilidades y funciones auxiliares
index.js -> Punto de entrada de la aplicación
config.js -> Configuración de credenciales aws-sdk
package.json -> Dependencias y comandos de npm

## Cómo ejecutar el servidor

1. Asegúrate de tener Node.js y npm instalados en tu máquina.
2. Clona el repositorio: `git clone <url-del-repositorio>`
3. Navega al directorio del proyecto: `cd <nombre-del-proyecto>`
4. Instala las dependencias: `npm install`
5. Configura las variables de entorno en el archivo `config.js`.
6. Inicia el servidor: `npm start`
7. El servidor estará en funcionamiento en `http://localhost:8080`.

## Endpoints

### `POST /task`

Crea una nueva tarea asociada a una imagen.

**Body:**
{
"image": <archivo-de-imagen>
}

markdown
Copy code

**Respuesta exitosa:**
{
"message": "Image saved successfully"
}

markdown
Copy code

### `GET /task/:taskId`

Obtiene el estado de una tarea específica.

**Parámetros de ruta:**
- `taskId`: ID de la tarea.

**Respuesta exitosa:**
{
"taskId": <taskId>,
"status": <estado-de-la-tarea>
}

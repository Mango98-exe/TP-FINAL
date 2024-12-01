# TP-FINAL
 Integrantes: Tomas Capriotti, Gabriel Sanchez, Claudio Gonzalez.

 Integrante Lider del proyecto: Tomas Capriotti. Encargado de gestionar, hacer el codigo mas ordenado, mayor parte del desarrollo.
 Desarrolladores: Gabriel Sanchez y Claudio Gonzalez. Acompañamiento y ayuda en el desarrollo, sin ellos no podriamos terminarlo. 
 
 
# Simple CRUD API with JWT Authentication

Este proyecto es una API básica implementada con Node.js, Express y Mongoose. Utiliza JWT (JSON Web Tokens) para la autenticación de usuarios y proporciona funcionalidades CRUD para gestionar integrantes en una base de datos MongoDB y Productos para una tienda.

## Descripción del código

El archivo `index.js` maneja la configuración de las rutas, la autenticación y la conexión a la base de datos.

### 1. **Dependencias utilizadas**
- `express`: Framework de Node.js para crear y manejar rutas HTTP.
- `mongoose`: Librería para interactuar con MongoDB.
- `jsonwebtoken`: Para crear y verificar JWT (tokens de autenticación).
- `dotenv`: Para gestionar variables de entorno.


4. Rutas
/login (POST)
Esta ruta permite la autenticación del usuario. Se reciben las credenciales del usuario (nombre de usuario y contraseña) y, si son válidas, se genera un token JWT para el acceso posterior.

Si las credenciales son correctas, se genera un token JWT y se envía como respuesta.
Si las credenciales son incorrectas, se responde con un error.
/integrantes (GET)
Ruta protegida con JWT. Esta ruta devuelve una lista de todos los integrantes almacenados en la base de datos. Solo puede ser accedida si el usuario proporciona un token válido.

/integrantes/:dni (GET)
Ruta protegida por JWT que permite buscar un integrante por su DNI. Si el integrante existe, se devuelve el objeto correspondiente, de lo contrario se obtiene un error 404.

/integrantes/agregar (POST)
Esta ruta permite agregar un nuevo integrante a la base de datos. No requiere autenticación, pero los datos enviados deben pasar la validación de Joi. Si los datos son válidos, el integrante se agrega a la base de datos y se devuelve el objeto creado.

/integrantes/:email (PUT)
Ruta protegida por JWT. Permite actualizar el apellido de un integrante buscando por su correo electrónico. Si el integrante se encuentra, se actualiza el apellido y se devuelve el objeto actualizado.

/integrantes/:dni (DELETE)
Ruta protegida por JWT. Permite eliminar un integrante de la base de datos buscando por su DNI. Si el integrante se encuentra, se elimina y se devuelve el mensaje de éxito.

## API de Productos

El archivo `product.controller.js` maneja las operaciones CRUD para los productos en la base de datos. A continuación se describen las funciones principales:

### Funciones:

1. **getProducts**: Obtiene todos los productos.
   - **Método**: GET /api/products
   
2. **getProduct**: Obtiene un producto específico por ID.
   - **Método**: GET /api/products/:id

3. **createProduct**: Crea un nuevo producto.
   - **Método**: POST /api/products
   - **Cuerpo de la solicitud**: { "nombre": "Producto", "descripcion": "Desc", "precio": 100 }

4. **updateProduct**: Actualiza un producto por ID.
   - **Método**: PUT /api/products/:id
   - **Cuerpo de la solicitud**: { "nombre": "Nuevo Producto", "descripcion": "Desc", "precio": 150 }

5. **deleteProduct**: Elimina un producto por ID.
   - **Método**: DELETE /api/products/:id

### Rutas y Controladores:
Las rutas en product.route.js se asignan a los controladores del archivo product.controller.js para gestionar las operaciones CRUD de productos.

###La conexión a la base de datos MongoDB se realiza utilizando mongoose.connect(), con la URI de conexión almacenada en las variables de entorno:

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a la base de datos!");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Conexión fallida");
  });

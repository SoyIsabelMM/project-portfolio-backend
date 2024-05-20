# Backend del Proyecto de PortFolio

Este repositorio contiene el código fuente del servicio backend para un proyecto de portafolio basado en Express. El backend proporciona endpoints para la gestión de usuarios, perfiles de usuario, portafolios y más.

### Importancia del Backend

El backend es una parte fundamental de cualquier aplicación web, ya que se encarga de gestionar la lógica de negocio, la comunicación con la base de datos y la seguridad. En el caso de un proyecto de **Portfolio**, el backend es responsable de manejar la autenticación de usuarios, el almacenamiento de datos de usuario y portafolio, así como la comunicación con el frontend.

### Especificaciones para Clonar

1. Para clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

```bash
git clone https://github.com/tuusuario/project-portfolio-backend.git

```

2. Ve al directorio del proyecto:

```bash
cd project-portfolio-backend

```

3. Crea un archivo **.env** basado en el archivo **.env-example** proporcionado en el repositorio y configura las variables de entorno según tu entorno de desarrollo.

4. Instala las dependencias:

```bash
npm install

```

### Cómo Correr en Local

1. Para ejecutar el servidor en tu máquina local, sigue estos pasos:

```bash
npm start

```

Esto iniciará el servidor en modo de observación (watch), lo que significa que los cambios que realices en el código se reflejarán automáticamente.

## Tecnologías Utilizadas

- **Node.js:** Plataforma de ejecución de JavaScript.
- **Express:** Marco de aplicación web para Node.js.
- **MongoDB:** Base de datos NoSQL utilizada para almacenar los datos del usuario y portafolio.
- **Mongoose:** Biblioteca de modelado de objetos para MongoDB.
- **JWT:** JSON Web Tokens para la autenticación de usuarios.
- **Multer:** Middleware para manejar la carga de archivos.
- **Celebrate:** Middleware para la validación de datos en Express.

## Uso

Este backend proporciona una **API RESTful** que puede ser consumida por un frontend para mostrar perfiles de usuario y portafolios. Los endpoints están diseñados para permitir operaciones **CRUD** (Crear, Leer, Actualizar, Eliminar) en usuarios y portafolios, así como la autenticación de usuarios.

## Contribución

_¡Tus contribuciones son bienvenidas!_ Si deseas mejorar este proyecto, puedes enviar un pull request con tus cambios o abrir un issue si encuentras algún problema o tienes alguna sugerencia.

¡Gracias por tu interés en contribuir al proyecto de portafolio! 😊

## Autor

- [Linkedin - SoyIsabelMM](https://www.linkedin.com/in/soyisabelmm/)

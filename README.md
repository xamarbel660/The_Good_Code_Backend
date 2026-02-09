# The Good Code - Backend API

Bienvenido al backend de **The Good Code**, una API RESTful desarrollada con **Node.js, Express y Sequelize** para la gestión integral de campañas de donación de sangre y registro de donaciones.

Este proyecto forma parte de la práctica de **Optativa GS - Desarrollo de aplicaciones híbridas y en entorno servidor** del curso 2º DAM.

## 🔗 Enlace al Repositorio

Puedes encontrar el código fuente completo en el repositorio de GitHub:
[The_Good_Code_Backend](https://github.com/xamarbel660/The_Good_Code_Backend)

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* **Node.js** (v18 o superior recomendado)

* **MySQL** (o un contenedor Docker con MySQL)

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos para levantar el servidor en tu entorno local:

### 1. Clonar el repositorio

Descarga el código fuente a tu máquina:

```Bash
git clone https://github.com/xamarbel660/The_Good_Code_Backend.git
cd The_Good_Code_Backend
```

### 2. Instalar dependencias

Ejecuta el siguiente comando para descargar las librerías necesarias para el proyecto (Express, Sequelize, MySQL2, etc.):

```Bash
npm install
```

### 3. Configurar la Base de Datos

Asegúrate de que tu servicio MySQL (o Docker) esté encendido.

Importa el archivo SQL proporcionado en la carpeta **/sql** para tener la estructura y datos iniciales.

### 4. Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto. Puedes copiar el contenido de la sección "Ejemplo de configuración" de abajo.

### 5. Iniciar el servidor

Para levantar el proyecto en modo desarrollo (con recarga automática):

```Bash
npm run dev
```

Si todo es correcto, verás un mensaje en la consola indicando que el servidor corre en el puerto 3000 y la conexión a la BD ha sido exitosa.

## ⚙️ Ejemplo de configuración (.env)

Crea un archivo `.env` en la raíz del proyecto y copia la siguiente configuración:

```properties
# --- Configuración del Servidor ---
PORT=3000
NODE_ENV=development

# --- Configuración de la Base de Datos (MySQL) ---
# Host de la base de datos (habitualmente localhost o la IP de tu Docker)
DB_HOST=localhost
# Usuario de tu base de datos local
DB_USER=root
# Contraseña de tu usuario root (cámbiala por la tuya)
DB_PASSWORD=test
# Nombre de la base de datos
DB_NAME=the_good_code
# Puerto de MySQL (3306 es el estándar)
DB_PORT=3306

# (Opcional) Clave secreta si se implementara JWT
SECRET_KEY=mi_clave_secreta
```

## 📡 Documentación de la API

La API expone los siguientes endpoints principales:

### 🩸 Campañas (`/api/campanas`)

Gestión de las campañas de donación.

* **GET `/api/campanas`**: Recupera todas las campañas. Admite los siguientes filtros por **query params**:
  * `nombre_campana`: Filtrar por nombre (parcial).
  * `objetivo_litros_campana_min` / `objetivo_litros_campana_max`: Rango de litros objetivo.
  * `fecha_inicio_campana` / `fecha_fin_campana`: Filtrar por fechas.
  * `urgente_campana`: Filtrar por urgencia (`true`/`false`).
* **GET `/api/campanas/graph`**: Datos optimizados para visualización en gráficas.
* **GET `/api/campanas/:id`**: Obtiene el detalle de una campaña específica.
* **POST `/api/campanas`**: Crea una nueva campaña.
* **PUT `/api/campanas/:id`**: Actualiza una campaña existente.
* **DELETE `/api/campanas/:id`**: Elimina una campaña.

### 🎁 Donaciones (`/api/donaciones`)

Registro y consulta de donaciones realizadas.

* **GET `/api/donaciones`**: Listado de todas las donaciones.
* **GET `/api/donaciones/:id`**: Detalle de una donación.
* **GET `/api/donaciones/cards/:page`**: Obtiene donaciones paginadas para vista de tarjetas.
* **POST `/api/donaciones`**: Registra una nueva donación.
* **PUT `/api/donaciones/:id`**: Modifica una donación.
* **DELETE `/api/donaciones/:id`**: Elimina un registro de donación.

## 🧪 Tests

El proyecto incluye pruebas automatizadas con **Jest**. Para ejecutarlas:

```Bash
npm test
```

## 🔧 Comandos Útiles

Si realizas cambios en la estructura de la base de datos, puedes regenerar los modelos de Sequelize usando `sequelize-auto`:

```Bash
node ./config/sequelize-auto.js
```

*Nota: Asegúrate de tener las credenciales correctas en tu configuración antes de ejecutar este script.*

## ✒️ Autor

Proyecto realizado por [Adrián Márquez Bellido](https://github.com/xamarbel660) para el módulo de HLC - 2026.

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

Crea un archivo llamado .env en la raíz del proyecto. Puedes copiar el contenido de la sección "Ejemplo de configuración" de abajo.

### 5. Iniciar el servidor

Para levantar el proyecto en modo desarrollo (con recarga automática):

```Bash
npm run dev
```

Si todo es correcto, verás un mensaje en la consola indicando que el servidor corre en el puerto 3000 y la conexión a la BD ha sido exitosa.

## ⚙️ Ejemplo de configuración (.env)

Crea un archivo .env en la raíz del proyecto y copia la siguiente configuración:

```Fragmento de código
# --- Configuración del Servidor ---
PORT=3000
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
# SECRET_KEY=mi_clave_secreta
```

## ✒️ Autor

Proyecto realizado por [Adrián Márquez Bellido](https://github.com/xamarbel660) para el módulo de HLC - 2026.

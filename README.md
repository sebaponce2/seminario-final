## **README: Proyecto Seminario Final**

### **Drive de Archivos necesarios y Demo**

En este drive encontraremos los archivos necesarios para la configuración del proyecto, y el video de la Demo: 
[https://drive.google.com/drive/folders/1PNeOlvwKMRPMaMokPXEoaEP8IloX-OTm?usp=drive_link](https://drive.google.com/drive/folders/1PNeOlvwKMRPMaMokPXEoaEP8IloX-OTm?usp=drive_link)

### **Clonación del Proyecto**

Una vez descargados los archivos, cloná el proyecto. Abrí tu terminal y ejecutá el siguiente comando:

```bash
git clone https://github.com/tu-usuario/seminario-final.git
```

### **Configuración del Backend**

1. **Base de Datos:**
   * Creá una base de datos local en PostgreSQL.
   * Ejecutá el script SQL ubicado en `seminario-final/api/Script base de datos.sql` para crear las tablas y relaciones necesarias.

2. **Archivo .env:**
   * Renombrá el archivo `.env-backend` a `.env` y colocalo en la carpeta `seminario-final/api`.
   * Editá el archivo `.env` y rellená las variables de entorno con los datos de tu base de datos local (solo DB_HOST, DB_NAME, DB_PASSWORD, DB_USER).

3. **Archivo serviceAccountKey.json:**
   * Colocá el archivo `serviceAccountKey.json` en la carpeta `seminario-final/api/config`. Este archivo es necesario para la autenticación con Firebase.

4. **Instalación de Dependencias y Ejecución:**
   * Abrí una terminal y navegá hasta la carpeta `seminario-final/api`.
   * Ejecutá el comando `npm install` para instalar las dependencias del proyecto.
   * Una vez finalizada la instalación, ejecutá `npm run dev` para iniciar el servidor backend.

### **Configuración del Frontend**

1. **Archivo .env:**
   * Renombrá el archivo `.env-frontend` a `.env` y colocalo en la carpeta `seminario-final/frontend`.

2. **Instalación de Dependencias y Ejecución:**
   * Abrí una terminal y navegá hasta la carpeta `seminario-final/frontend`.
   * Ejecutá el comando `npm install` para instalar las dependencias del proyecto.
   * Una vez finalizada la instalación, ejecutá `npm run dev` para iniciar la aplicación frontend.

**¡Y listo!** Con estos pasos, deberías tener el proyecto funcionando localmente.

**Usuario administrador**
* Email: admin@gmail.com
* Contraseña: Admin21#

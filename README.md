## **README: Proyecto Seminario Final**

### **Descarga de Archivos**

Para comenzar, descarga todos los archivos necesarios desde el siguiente enlace: 
[https://drive.google.com/drive/folders/1PNeOlvwKMRPMaMokPXEoaEP8IloX-OTm?usp=drive_link](https://drive.google.com/drive/folders/1PNeOlvwKMRPMaMokPXEoaEP8IloX-OTm?usp=drive_link)

### **Clonación del Proyecto**

Una vez descargados los archivos, clona el proyecto. Abre tu terminal y ejecuta el siguiente comando:

```bash
git clone https://github.com/tu-usuario/seminario-final.git
```

### **Configuración del Backend**

1. **Base de Datos:**
   * Crea una base de datos local en PostgreSQL.
   * Ejecuta el script SQL ubicado en `seminario-final/api/Script base de datos.sql` para crear las tablas y relaciones necesarias.

2. **Archivo .env:**
   * Renombra el archivo `.env-backend` a `.env` y colocalo en la carpeta `seminario-final/api`.
   * Edita el archivo `.env` y rellena las variables de entorno con los datos de tu base de datos local (solo DB_HOST, DB_NAME, DB_PASSWORD, DB_USER).

3. **Archivo serviceAccountKey.json:**
   * Coloca el archivo `serviceAccountKey.json` en la carpeta `seminario-final/api/config`. Este archivo es necesario para la autenticación con Firebase.

4. **Instalación de Dependencias y Ejecución:**
   * Abre una terminal y navega hasta la carpeta `seminario-final/api`.
   * Ejecuta el comando `npm install` para instalar las dependencias del proyecto.
   * Una vez finalizada la instalación, ejecuta `npm run dev` para iniciar el servidor backend.

### **Configuración del Frontend**

1. **Archivo .env:**
   * Renombra el archivo `.env-frontend` a `.env` y colOcalo en la carpeta `seminario-final/frontend`.

2. **Instalación de Dependencias y Ejecución:**
   * Abre una terminal y navega hasta la carpeta `seminario-final/frontend`.
   * Ejecuta el comando `npm install` para instalar las dependencias del proyecto.
   * Una vez finalizada la instalación, ejecuta `npm run dev` para iniciar la aplicación frontend.

**¡Y listo!** Con estos pasos, deberías tener el proyecto funcionando localmente.

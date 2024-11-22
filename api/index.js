import express, { json } from 'express';
import { connectDB, sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import { decodeToken } from './middleware/index.js';

const app = express();

// Conectar a la base de datos
connectDB();

app.use(cors());
// Middlewares
app.use(json());
app.use(decodeToken);

// Sincronizar modelos con la base de datos
sequelize.sync().then(() => console.log('Modelos sincronizados'));

// Rutas
app.use('/api', userRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
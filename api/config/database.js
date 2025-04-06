import 'dotenv/config'; 
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Para desactivar el log de SQL queries
  define: {
    freezeTableName: true, // Evita que Sequelize pluralice los nombres de las tablas
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos PostgreSQL');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  }
};


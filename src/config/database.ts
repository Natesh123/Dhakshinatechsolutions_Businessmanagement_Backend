import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as mysql2 from 'mysql2'; // Required for Sequelize with bundlers

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const dbName = process.env.DB_NAME || 'dhakshina_business';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  dialectModule: mysql2, // Explicitly provide the dialect module for bundlers
  logging: false, // Set to true to see SQL queries
  define: {
    timestamps: true,
    underscored: true
  },
  dialectOptions: process.env.DB_SSL === 'true' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't exit the process in a serverless environment, just log it.
    // process.exit(1); 
  }
};

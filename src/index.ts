import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/database';

dotenv.config();

import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import projectRoutes from './routes/projectRoutes';
import quotationRoutes from './routes/quotationRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import staffRoutes from './routes/staffRoutes';
import salaryRoutes from './routes/salaryRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import noteRoutes from './routes/noteRoutes';

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/notes', noteRoutes);

// Test Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'API is running smoothly.' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  // Sync database models
  // Note: in production, use migrations instead of sync()
  await sequelize.sync({ alter: true });
  console.log('Database synchronized.');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

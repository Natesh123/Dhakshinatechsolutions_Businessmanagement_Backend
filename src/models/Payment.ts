import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Invoice } from './Invoice';
import { Client } from './Client';

interface PaymentAttributes {
  id: number;
  receiptNumber: string;
  invoiceId: number;
  clientId: number;
  paymentDate: Date;
  amount: number;
  paymentMode: string; // e.g., Cash, Bank Transfer, UPI, Cheque
  referenceNumber: string | null; // e.g., Transaction ID, Cheque Number
  notes: string | null;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'referenceNumber' | 'notes'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public receiptNumber!: string;
  public invoiceId!: number;
  public clientId!: number;
  public paymentDate!: Date;
  public amount!: number;
  public paymentMode!: string;
  public referenceNumber!: string | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  receiptNumber: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  invoiceId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Invoice, key: 'id' }
  },
  clientId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Client, key: 'id' }
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  referenceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'payments',
  sequelize,
});

// Relationships
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Client.hasMany(Payment, { foreignKey: 'clientId', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

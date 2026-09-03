import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface StaffAttributes {
  id: number;
  name: string;
  designation: string;
  mobile: string;
  email: string | null;
  address: string | null;
  baseSalary: number;
  joinDate: Date;
  status: string; // Active, Inactive
}

interface StaffCreationAttributes extends Optional<StaffAttributes, 'id' | 'email' | 'address' | 'status'> {}

export class Staff extends Model<StaffAttributes, StaffCreationAttributes> implements StaffAttributes {
  public id!: number;
  public name!: string;
  public designation!: string;
  public mobile!: string;
  public email!: string | null;
  public address!: string | null;
  public baseSalary!: number;
  public joinDate!: Date;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Active',
  }
}, {
  tableName: 'staff',
  sequelize,
});

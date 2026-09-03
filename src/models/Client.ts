import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ClientAttributes {
  id: number;
  clientName: string;
  companyName: string | null;
  email: string | null;
  mobile: string | null;
  alternateMobile: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  notes: string | null;
  status: string;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'companyName' | 'email' | 'mobile' | 'alternateMobile' | 'address' | 'city' | 'state' | 'country' | 'pincode' | 'gstNumber' | 'panNumber' | 'notes' | 'status'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public clientName!: string;
  public companyName!: string | null;
  public email!: string | null;
  public mobile!: string | null;
  public alternateMobile!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public country!: string | null;
  public pincode!: string | null;
  public gstNumber!: string | null;
  public panNumber!: string | null;
  public notes!: string | null;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  clientName: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  companyName: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  mobile: { type: DataTypes.STRING(20), allowNull: true },
  alternateMobile: { type: DataTypes.STRING(20), allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING(20), allowNull: true },
  gstNumber: { type: DataTypes.STRING(50), allowNull: true },
  panNumber: { type: DataTypes.STRING(50), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Active' },
}, {
  tableName: 'clients',
  sequelize,
});

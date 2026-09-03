import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CompanySettingAttributes {
  id: number;
  companyName: string;
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  mobile: string | null;
  email: string | null;
  website: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  bankName: string | null;
  accountHolderName: string | null;
  accountNumber: string | null;
  ifsc: string | null;
  upiId: string | null;
  authorizedPersonName: string | null;
  signature: string | null;
  documentPrefix: string;
}

interface CompanySettingCreationAttributes extends Optional<CompanySettingAttributes, 'id' | 'logo' | 'address' | 'city' | 'state' | 'country' | 'pincode' | 'mobile' | 'email' | 'website' | 'gstNumber' | 'panNumber' | 'bankName' | 'accountHolderName' | 'accountNumber' | 'ifsc' | 'upiId' | 'authorizedPersonName' | 'signature'> {}

export class CompanySetting extends Model<CompanySettingAttributes, CompanySettingCreationAttributes> implements CompanySettingAttributes {
  public id!: number;
  public companyName!: string;
  public logo!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public country!: string | null;
  public pincode!: string | null;
  public mobile!: string | null;
  public email!: string | null;
  public website!: string | null;
  public gstNumber!: string | null;
  public panNumber!: string | null;
  public bankName!: string | null;
  public accountHolderName!: string | null;
  public accountNumber!: string | null;
  public ifsc!: string | null;
  public upiId!: string | null;
  public authorizedPersonName!: string | null;
  public signature!: string | null;
  public documentPrefix!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CompanySetting.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  companyName: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  logo: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING(20), allowNull: true },
  mobile: { type: DataTypes.STRING(20), allowNull: true },
  email: { type: DataTypes.STRING(100), allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true },
  gstNumber: { type: DataTypes.STRING(50), allowNull: true },
  panNumber: { type: DataTypes.STRING(50), allowNull: true },
  bankName: { type: DataTypes.STRING, allowNull: true },
  accountHolderName: { type: DataTypes.STRING, allowNull: true },
  accountNumber: { type: DataTypes.STRING, allowNull: true },
  ifsc: { type: DataTypes.STRING(20), allowNull: true },
  upiId: { type: DataTypes.STRING, allowNull: true },
  authorizedPersonName: { type: DataTypes.STRING, allowNull: true },
  signature: { type: DataTypes.STRING, allowNull: true },
  documentPrefix: { type: new DataTypes.STRING(10), allowNull: false, defaultValue: 'DTS' }
}, {
  tableName: 'company_settings',
  sequelize,
});

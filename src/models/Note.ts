import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface NoteAttributes {
  id: number;
  title: string;
  content: string;
  relatedTo?: string;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public relatedTo?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Note.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedTo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'notes',
  sequelize,
});

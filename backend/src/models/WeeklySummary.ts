import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db';

export interface WeeklySummaryAttributes {
  id: string;
  userId: string;
  weekStart: Date;
  rupeesSaved: number;
  co2SavedKg: number;
  actionsCount: number;
  cityText: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WeeklySummaryCreationAttributes extends Omit<WeeklySummaryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class WeeklySummary extends Model<WeeklySummaryAttributes, WeeklySummaryCreationAttributes> implements WeeklySummaryAttributes {
  public id!: string;
  public userId!: string;
  public weekStart!: Date;
  public rupeesSaved!: number;
  public co2SavedKg!: number;
  public actionsCount!: number;
  public cityText!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WeeklySummary.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    weekStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rupeesSaved: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    co2SavedKg: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    actionsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cityText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'WeeklySummary',
    tableName: 'weekly_summaries',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['weekStart'],
      },
      {
        unique: true,
        fields: ['userId', 'weekStart'],
      },
    ],
  }
);

export default WeeklySummary;

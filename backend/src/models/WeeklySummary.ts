import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface WeeklySummaryAttributes {
  id: string;
  userId: string;
  weekStart: Date;
  rupeesSaved: number;
  co2SavedKg: number;
  actionsCount: number;
  cityText: string | null;
  createdAt: Date;
}

interface WeeklySummaryCreationAttributes extends Optional<WeeklySummaryAttributes, 'id' | 'createdAt'> {}

class WeeklySummary extends Model<WeeklySummaryAttributes, WeeklySummaryCreationAttributes> implements WeeklySummaryAttributes {
  public id!: string;
  public userId!: string;
  public weekStart!: Date;
  public rupeesSaved!: number;
  public co2SavedKg!: number;
  public actionsCount!: number;
  public cityText!: string | null;
  public readonly createdAt!: Date;
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
      field: 'week_start',
    },
    rupeesSaved: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'rupees_saved',
    },
    co2SavedKg: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      field: 'co2_saved_kg',
    },
    actionsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'actions_count',
    },
    cityText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'city_text',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    modelName: 'WeeklySummary',
    tableName: 'weekly_summaries',
    timestamps: false, // Only createdAt, no updatedAt
    indexes: [
      {
        unique: true,
        fields: ['userId', 'week_start'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

export default WeeklySummary;


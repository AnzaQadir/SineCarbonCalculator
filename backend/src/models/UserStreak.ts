import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db';

export interface UserStreakAttributes {
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActionDate: Date | null;
  updatedAt?: Date;
}

interface UserStreakCreationAttributes extends Omit<UserStreakAttributes, 'updatedAt'> {}

class UserStreak extends Model<UserStreakAttributes, UserStreakCreationAttributes> implements UserStreakAttributes {
  public userId!: string;
  public currentStreakDays!: number;
  public longestStreakDays!: number;
  public lastActionDate!: Date | null;
  public readonly updatedAt!: Date;
}

UserStreak.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    currentStreakDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    longestStreakDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastActionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserStreak',
    tableName: 'user_streaks',
    timestamps: true,
    updatedAt: true,
    createdAt: false,
  }
);

export default UserStreak;

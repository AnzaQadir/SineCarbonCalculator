import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserStreakAttributes {
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActionDate: Date | null;
  updatedAt: Date;
}

interface UserStreakCreationAttributes extends Optional<UserStreakAttributes, 'updatedAt'> {}

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
      field: 'current_streak_days',
    },
    longestStreakDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'longest_streak_days',
    },
    lastActionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_action_date',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserStreak',
    tableName: 'user_streaks',
    timestamps: false, // Only updatedAt, no createdAt
    updatedAt: 'updatedAt',
  }
);

export default UserStreak;


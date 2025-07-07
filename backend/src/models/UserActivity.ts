import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';

// Interface for UserActivity attributes
interface UserActivityAttributes {
  id: string;
  userId: string;
  activityType: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Interface for UserActivity creation attributes
interface UserActivityCreationAttributes extends Optional<UserActivityAttributes, 'id' | 'createdAt'> {}

class UserActivity extends Model<UserActivityAttributes, UserActivityCreationAttributes> implements UserActivityAttributes {
  public id!: string;
  public userId!: string;
  public activityType!: string;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
}

UserActivity.init(
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
        model: User,
        key: 'id',
      },
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'user_activities',
    timestamps: false, // We only want createdAt, not updatedAt
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['activityType'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

// Define associations
User.hasMany(UserActivity, { foreignKey: 'userId', as: 'activities' });
UserActivity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default UserActivity; 
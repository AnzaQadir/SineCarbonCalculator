import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';

export interface UserSessionAttributes {
  id: string;
  sessionId: string;
  userId?: string;
  lastSeen: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSessionCreationAttributes extends Omit<UserSessionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'lastSeen'> {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastSeen?: Date;
}

class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> implements UserSessionAttributes {
  public id!: string;
  public sessionId!: string;
  public userId?: string;
  public lastSeen!: Date;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserSession',
    tableName: 'user_sessions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['sessionId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['lastSeen'],
      },
    ],
  }
);

export default UserSession; 
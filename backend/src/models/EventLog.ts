import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';

export interface EventLogAttributes {
  id: string;
  eventId: string;
  sessionId: string;
  eventType: string;
  payload?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventLogCreationAttributes extends Omit<EventLogAttributes, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'> {
  id?: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class EventLog extends Model<EventLogAttributes, EventLogCreationAttributes> implements EventLogAttributes {
  public id!: string;
  public eventId!: string;
  public sessionId!: string;
  public eventType!: string;
  public payload?: Record<string, any>;
  public timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user_sessions',
        key: 'sessionId',
      },
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    modelName: 'EventLog',
    tableName: 'event_logs',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['eventId'],
      },
      {
        fields: ['sessionId'],
      },
      {
        fields: ['eventType'],
      },
      {
        fields: ['timestamp'],
      },
    ],
  }
);

export default EventLog; 
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserActionEventAttributes {
  userId: string;
  recommendationId: string;
  eventType: 'SHOWN' | 'DONE' | 'DISMISS' | 'SNOOZE';
  occurredAt: Date;
}

interface UserActionEventCreationAttributes extends Optional<UserActionEventAttributes, 'occurredAt'> {}

class UserActionEvent extends Model<UserActionEventAttributes, UserActionEventCreationAttributes> implements UserActionEventAttributes {
  public userId!: string;
  public recommendationId!: string;
  public eventType!: 'SHOWN' | 'DONE' | 'DISMISS' | 'SNOOZE';
  public occurredAt!: Date;
}

UserActionEvent.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    recommendationId: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: 'recommendation_id',
    },
    eventType: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'event_type',
      validate: {
        isIn: [['SHOWN', 'DONE', 'DISMISS', 'SNOOZE']],
      },
    },
    occurredAt: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'occurred_at',
    },
  },
  {
    sequelize,
    modelName: 'UserActionEvent',
    tableName: 'user_action_events',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id', 'occurred_at'],
      },
      {
        fields: ['recommendation_id'],
      },
      {
        fields: ['user_id', 'event_type'],
      },
      {
        fields: ['event_type'],
      },
    ],
  }
);

export default UserActionEvent;


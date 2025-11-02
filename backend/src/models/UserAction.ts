import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db';

export interface UserActionAttributes {
  id: string;
  userId: string;
  recommendationId: string;
  occurredAt: Date;
  impactRupees: number;
  impactCo2Kg: number;
  source: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserActionCreationAttributes extends Omit<UserActionAttributes, 'id' | 'occurredAt' | 'createdAt' | 'updatedAt'> {
  occurredAt?: Date;
}

class UserAction extends Model<UserActionAttributes, UserActionCreationAttributes> implements UserActionAttributes {
  public id!: string;
  public userId!: string;
  public recommendationId!: string;
  public occurredAt!: Date;
  public impactRupees!: number;
  public impactCo2Kg!: number;
  public source!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserAction.init(
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
    recommendationId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'ID from recommendation catalog (e.g., clothing_repair_first_kit)',
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    impactRupees: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    impactCo2Kg: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'catalog:v1',
    },
  },
  {
    sequelize,
    modelName: 'UserAction',
    tableName: 'user_actions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['recommendationId'],
      },
      {
        fields: ['occurredAt'],
      },
      {
        unique: true,
        fields: ['userId', 'recommendationId'],
        name: 'unique_user_reco_per_day',
      },
    ],
  }
);

export default UserAction;

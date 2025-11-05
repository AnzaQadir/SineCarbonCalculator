import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserActionAttributes {
  id: string;
  userId: string;
  recommendationId: string;
  occurredAt: Date;
  impactRupees: number;
  impactCo2Kg: number;
  surface: string;
  metadata: Record<string, any>;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserActionCreationAttributes extends Optional<UserActionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserAction extends Model<UserActionAttributes, UserActionCreationAttributes> implements UserActionAttributes {
  public id!: string;
  public userId!: string;
  public recommendationId!: string;
  public occurredAt!: Date;
  public impactRupees!: number;
  public impactCo2Kg!: number;
  public surface!: string;
  public metadata!: Record<string, any>;
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
      type: DataTypes.STRING, // Using string since catalog uses string IDs
      allowNull: false,
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    impactRupees: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'impact_rupees',
    },
    impactCo2Kg: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      defaultValue: 0,
      field: 'impact_co2_kg',
    },
    surface: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'web',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'catalog:v1',
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
    modelName: 'UserAction',
    tableName: 'user_actions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'occurredAt'],
      },
      {
        fields: ['recommendationId'],
      },
      {
        fields: ['userId', 'recommendationId'],
      },
    ],
  }
);

export default UserAction;


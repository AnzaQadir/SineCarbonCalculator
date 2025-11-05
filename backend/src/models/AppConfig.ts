import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface AppConfigAttributes {
  key: string;
  value: Record<string, any>;
  updatedAt: Date;
}

interface AppConfigCreationAttributes extends Optional<AppConfigAttributes, 'updatedAt'> {}

class AppConfig extends Model<AppConfigAttributes, AppConfigCreationAttributes> implements AppConfigAttributes {
  public key!: string;
  public value!: Record<string, any>;
  public readonly updatedAt!: Date;
}

AppConfig.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'AppConfig',
    tableName: 'app_configs',
    timestamps: false, // Only updatedAt, no createdAt
    updatedAt: 'updatedAt',
  }
);

export default AppConfig;


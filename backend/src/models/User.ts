import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Interface for User attributes
interface UserAttributes {
  id: string;
  email: string;
  firstName?: string;
  age?: string;
  gender?: string;
  profession?: string;
  country?: string;
  city?: string;
  household?: string;
  waitlistPosition: number;
  ctaVariant?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User creation attributes (optional fields)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public firstName?: string;
  public age?: string;
  public gender?: string;
  public profession?: string;
  public country?: string;
  public city?: string;
  public household?: string;
  public waitlistPosition!: number;
  public ctaVariant?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    household: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    waitlistPosition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    ctaVariant: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'A',
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['waitlistPosition'],
      },
    ],
  }
);

export default User; 
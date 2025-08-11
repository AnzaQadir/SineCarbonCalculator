import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Interface for UserPersonality attributes
interface UserPersonalityAttributes {
  id: string;
  userId: string;
  sessionId?: string;
  catalogVersion?: string;
  personalityType?: string;
  newPersonality?: string;
  response: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  calculationTimeMs?: number;
  status: 'success' | 'failed';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for UserPersonality creation attributes
interface UserPersonalityCreationAttributes extends Optional<UserPersonalityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserPersonality extends Model<UserPersonalityAttributes, UserPersonalityCreationAttributes> implements UserPersonalityAttributes {
  public id!: string;
  public userId!: string;
  public sessionId?: string;
  public catalogVersion?: string;
  public personalityType?: string;
  public newPersonality?: string;
  public response!: Record<string, any>;
  public metadata?: Record<string, any>;
  public ipAddress?: string;
  public userAgent?: string;
  public calculationTimeMs?: number;
  public status!: 'success' | 'failed';
  public errorMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserPersonality.init(
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
    sessionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'user_sessions',
        key: 'sessionId',
      },
    },
    catalogVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Version of the personality catalog used for calculation',
    },
    personalityType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Legacy personality type (7 types)',
    },
    newPersonality: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'New personality archetype (10 types)',
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Complete response from personality calculation including comprehensivePowerMoves',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata like quiz responses, preferences, etc.',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IP address of the user for analytics',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent string for device/browser analytics',
    },
    calculationTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Time taken for personality calculation in milliseconds',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'success',
      comment: 'Whether the calculation was successful or failed (success/failed)',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Error message if calculation failed',
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
    modelName: 'UserPersonality',
    tableName: 'user_personalities',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['sessionId'],
      },
      {
        fields: ['personalityType'],
      },
      {
        fields: ['newPersonality'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['catalogVersion'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['userId', 'createdAt'],
      },
    ],
  }
);

export default UserPersonality;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserPersonalityExtendedAttributes {
  userId: string;
  archetypeScores: Record<string, number>;
  personaVector: {
    TimeSaver: number;
    MoneyMax: number;
    EcoGuardian: number;
    SocialSharer: number;
  };
  weightPrefs: {
    pkr: number;
    time: number;
    co2: number;
    effort: number;
    novelty: number;
    recency: number;
    diversity: number;
    fit: number;
  };
  updatedAt: Date;
}

interface UserPersonalityExtendedCreationAttributes extends Optional<UserPersonalityExtendedAttributes, 'updatedAt'> {}

class UserPersonalityExtended extends Model<UserPersonalityExtendedAttributes, UserPersonalityExtendedCreationAttributes> implements UserPersonalityExtendedAttributes {
  public userId!: string;
  public archetypeScores!: Record<string, number>;
  public personaVector!: {
    TimeSaver: number;
    MoneyMax: number;
    EcoGuardian: number;
    SocialSharer: number;
  };
  public weightPrefs!: {
    pkr: number;
    time: number;
    co2: number;
    effort: number;
    novelty: number;
    recency: number;
    diversity: number;
    fit: number;
  };
  public readonly updatedAt!: Date;
}

UserPersonalityExtended.init(
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
    archetypeScores: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'archetype_scores',
      defaultValue: {},
    },
    personaVector: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'persona_vector',
      defaultValue: { TimeSaver: 0.25, MoneyMax: 0.25, EcoGuardian: 0.25, SocialSharer: 0.25 },
    },
    weightPrefs: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'weight_prefs',
      defaultValue: {
        pkr: 1.0,
        time: 1.0,
        co2: 1.0,
        effort: 1.0,
        novelty: 0.7,
        recency: 0.8,
        diversity: 0.6,
        fit: 1.0,
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null initially for migration, then we'll update existing rows
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'UserPersonalityExtended',
    tableName: 'user_personality_extended',
    timestamps: false,
    updatedAt: 'updatedAt',
  }
);

export default UserPersonalityExtended;


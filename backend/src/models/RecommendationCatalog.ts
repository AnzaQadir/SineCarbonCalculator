import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface RecommendationCatalogAttributes {
  id: string;
  category: string;
  title: string;
  subtitle: string | null;
  metrics: {
    pkrMonth?: number;
    minutes?: number;
    kgco2eMonth?: number;
  };
  effort: {
    steps?: number;
    requiresPurchase?: boolean;
    avgMinutesToDo?: number;
  };
  tags: string[];
  regions: string[];
  active: boolean;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RecommendationCatalogCreationAttributes
  extends Optional<RecommendationCatalogAttributes, 'createdAt' | 'updatedAt' | 'subtitle' | 'regions' | 'metadata'> {}

class RecommendationCatalog extends Model<RecommendationCatalogAttributes, RecommendationCatalogCreationAttributes> implements RecommendationCatalogAttributes {
  public id!: string;
  public category!: string;
  public title!: string;
  public subtitle!: string | null;
  public metrics!: {
    pkrMonth?: number;
    minutes?: number;
    kgco2eMonth?: number;
  };
  public effort!: {
    steps?: number;
    requiresPurchase?: boolean;
    avgMinutesToDo?: number;
  };
  public tags!: string[];
  public regions!: string[];
  public active!: boolean;
  public metadata!: Record<string, any> | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RecommendationCatalog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    effort: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    regions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
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
    modelName: 'RecommendationCatalog',
    tableName: 'recommendation_catalog',
    timestamps: true,
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['active'],
      },
    ],
  }
);

export default RecommendationCatalog;





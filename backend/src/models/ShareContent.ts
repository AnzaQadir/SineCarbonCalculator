import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export interface ShareContentAttributes {
  id: string;
  contentType: string; // e.g., 'personality'
  payload: Record<string, any>; // JSON blob of content
  imageUrl?: string | null; // optional hosted image
  createdAt: Date;
  updatedAt: Date;
}

type ShareContentCreationAttributes = Optional<ShareContentAttributes, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'>;

class ShareContent extends Model<ShareContentAttributes, ShareContentCreationAttributes> implements ShareContentAttributes {
  public id!: string;
  public contentType!: string;
  public payload!: Record<string, any>;
  public imageUrl?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShareContent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payload: {
      // use JSONB on postgres if available; JSON otherwise
      type: (DataTypes as any).JSONB || DataTypes.JSON,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
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
    modelName: 'ShareContent',
    tableName: 'share_contents',
    timestamps: true,
    indexes: [
      { fields: ['contentType'] },
    ],
  }
);

export default ShareContent;



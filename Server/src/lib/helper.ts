import { DataTypes } from "sequelize";
import { attributes } from "./types.js";

export function convertToSequelizeFormat(attributes: attributes) {
  const sequelizeAttributes: attributes = {};

  for (const [key, value] of Object.entries(attributes)) {
    const { type, allowNull } = value;
    let sequelizeType;

    switch (type) {
      case "VARCHAR":
        sequelizeType = DataTypes.STRING;
        break;
      case "INT":
        sequelizeType = DataTypes.INTEGER;
        break;
      case "DATE":
        sequelizeType = DataTypes.DATEONLY;
        break;
      case "BOOLEAN":
        sequelizeType = DataTypes.BOOLEAN;
        break;
      case "TEXT":
        sequelizeType = DataTypes.TEXT;
        break;

      default:
        throw new Error(`Unsupported data type: ${type}`);
    }

    sequelizeAttributes.id = {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    };

    sequelizeAttributes[key] = {
      type: sequelizeType,
      allowNull,
    };
  }

  return sequelizeAttributes;
}

import { DataTypes } from "sequelize";
export function convertToSequelizeFormat(attributes) {
    const sequelizeAttributes = {};
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
        // sequelizeAttributes.createdAt = {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        //   defaultValue: DataTypes.NOW,
        // };
        // sequelizeAttributes.updatedAt = {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        //   defaultValue: DataTypes.NOW,
        // };
        sequelizeAttributes[key] = {
            type: sequelizeType,
            allowNull,
        };
    }
    return sequelizeAttributes;
}

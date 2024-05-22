import { Sequelize } from "sequelize";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const connectToDB = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST!,
      dialect: "mysql",
      //@ts-ignore
      port: process.env.DB_PORT,
    }
  );

  const connection = mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: 17721,
    multipleStatements: true,
  });

  try {
    connection.connect((err) => {
      if (err) throw err;
      console.log("Connected to the database!");
    });

    // await sequelize.authenticate();
    // console.log("Connection has been established successfully.");

    return { sequelize, connection };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

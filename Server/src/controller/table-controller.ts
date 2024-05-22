import { DataTypes } from "sequelize";
import { connectToDB } from "../lib/database.js";
import { Request, Response } from "express";
import { convertToSequelizeFormat } from "../lib/helper.js";

export async function createtable(req: Request, res: Response) {
  const entityName = req.body.enitityName;
  const attributes = req.body.attributes;

  // console.log("entityName", entityName);
  // console.log("attributes", attributes);

  try {
    const { connection, sequelize } = await connectToDB();

    attributes.id = { type: "INT AUTO_INCREMENT PRIMARY KEY", required: true };
    attributes.createdAt = { type: "TIMESTAMP", required: true };
    attributes.updatedAt = { type: "TIMESTAMP", required: true };

    // Construct the CREATE TABLE query
    let query = `CREATE TABLE ${entityName} (`;

    const columns = Object.keys(attributes).map((attr) => {
      const { type, required } = attributes[attr];
      return `${attr} ${type}${required ? " NOT NULL" : ""}`;
    });

    query += columns.join(", ") + ")";

    connection.query(query, (err, results) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send({ error: err.message });
      }

      // Create triggers for automatic timestamp updates
      const triggerQuery = `
      CREATE TRIGGER ${entityName}_before_insert
      BEFORE INSERT ON ${entityName}
      FOR EACH ROW
      SET NEW.createdAt = CURRENT_TIMESTAMP, NEW.updatedAt = CURRENT_TIMESTAMP;

      CREATE TRIGGER ${entityName}_before_update
      BEFORE UPDATE ON ${entityName}
      FOR EACH ROW
      SET NEW.updatedAt = CURRENT_TIMESTAMP;
    `;

      connection.query(triggerQuery, (triggerErr, triggerResults) => {
        if (triggerErr) {
          console.log("triggerErr", triggerErr);
          return res.status(500).send({ error: triggerErr.message });
        }
        console.log("triggerErr1", triggerErr);

        console.log("triggerResults", triggerResults);

        res.send({
          message: `Table ${entityName} created successfully with triggers`,
          data: triggerResults,
        });
      });
    });
  } catch (error) {
    console.log("error", error);
  }
}

export async function getAllTables(req: Request, res: Response) {
  try {
    const { connection, sequelize } = await connectToDB();

    const query = "SHOW TABLES";

    // Execute the query using Sequelize
    const [results] = await sequelize.query(query);

    // console.log(results);

    res.status(200).json({ data: results, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tables" });
  }
}

export async function gettTableAttributes(req: Request, res: Response) {
  const tableName = req.params.tableName;

  try {
    const { connection, sequelize } = await connectToDB();

    const attributes = await sequelize
      .getQueryInterface()
      .describeTable(tableName);

    res.status(200).json({ data: attributes, success: true });
  } catch (error) {
    console.error("error ", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
}

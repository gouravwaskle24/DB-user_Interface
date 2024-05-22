import { Request, Response } from "express";
import { connectToDB } from "../lib/database.js";
import { Sequelize, json } from "sequelize";

export async function InsertData(req: Request, res: Response) {
  const { connection, sequelize } = await connectToDB();
  try {
    const body = req.body;
    console.log("body", body);

    const entityName = req.body.tablename;
    const data = req.body.Insertiondata;

    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((value) => (typeof value === "string" ? `'${value}'` : value))
      .join(", ");

    const query = `INSERT INTO ${entityName} (${columns}) VALUES (${values})`;

    connection.query(query, (err, results) => {
      if (err) {
        console.log("err", err);
        return res.status(500).send({ error: err.message });
      }
      res.send({
        message: `Data inserted successfully into ${entityName}`,
        //@ts-ignore
        insertId: results.insertId,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tables" });
  }
}

export async function getDatafromtable(req: Request, res: Response) {
  try {
    const { connection, sequelize } = await connectToDB();

    const { tablename } = req.params;

    // Ensure tableName is safe to use in a query to prevent SQL injection
    if (!/^[a-zA-Z0-9_]+$/.test(tablename)) {
      return res.status(400).send({ error: "Invalid table name" });
    }

    const query = `SELECT * FROM ??`; // Using ?? to escape table name
    connection.query(query, [tablename], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send({ error: "Failed to retrieve data" });
      }

      res.status(200).json({ data: results, success: true });
    });
  } catch (error) {
    console.log("error", error);
  }
}

export async function deletedatafromtable(req: Request, res: Response) {
  const { tablename, id } = req.params;

  try {
    const { connection, sequelize } = await connectToDB();
    // Construct the DELETE query
    const query = `DELETE FROM ?? WHERE id = ?`;

    // Execute the query
    connection.query(query, [tablename, id], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: err.message });
      }
      //@ts-ignore
      if (results?.affectedRows === 0) {
        return res.status(404).json({ message: "Row not found" });
      }

      res.json({
        message: `Row with ID ${id} deleted successfully from table ${tablename}`,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}

export async function updateDataInTable(req: Request, res: Response) {
  const { tablename, id } = req.params;
  // console.log({ tablename, id });
  const updates = req.body;
  // console.log({ updates });

  try {

    const {connection ,sequelize} = await  connectToDB()
    
    // Ensure updates is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    // Construct the SET clause of the UPDATE query
    const setClause = Object.keys(updates)
      .map((key) => `${connection.escapeId(key)} = ?`)
      .join(", ");

    const values = Object.values(updates);

    // Construct the full UPDATE query
    const query = `UPDATE ?? SET ${setClause} WHERE id = ?`;

    // Execute the query
    connection.query(query, [tablename, ...values, id], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: err.message });
      }
      //@ts-ignore
      if (results?.affectedRows === 0) {
        return res.status(404).json({ message: "Row not found" });
      }

      res.status(200).json({
        message: `Row with ID ${id} updated successfully in table ${tablename}`,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}

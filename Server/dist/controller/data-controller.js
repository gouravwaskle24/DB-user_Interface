var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connectToDB } from "../lib/database.js";
export function InsertData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { connection, sequelize } = yield connectToDB();
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching tables" });
        }
    });
}
export function getDatafromtable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { connection, sequelize } = yield connectToDB();
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
        }
        catch (error) {
            console.log("error", error);
        }
    });
}
export function deletedatafromtable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tablename, id } = req.params;
        try {
            const { connection, sequelize } = yield connectToDB();
            // Construct the DELETE query
            const query = `DELETE FROM ?? WHERE id = ?`;
            // Execute the query
            connection.query(query, [tablename, id], (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return res.status(500).json({ error: err.message });
                }
                //@ts-ignore
                if ((results === null || results === void 0 ? void 0 : results.affectedRows) === 0) {
                    return res.status(404).json({ message: "Row not found" });
                }
                res.json({
                    message: `Row with ID ${id} deleted successfully from table ${tablename}`,
                });
            });
        }
        catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    });
}
export function updateDataInTable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tablename, id } = req.params;
        // console.log({ tablename, id });
        const updates = req.body;
        // console.log({ updates });
        try {
            const { connection, sequelize } = yield connectToDB();
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
                if ((results === null || results === void 0 ? void 0 : results.affectedRows) === 0) {
                    return res.status(404).json({ message: "Row not found" });
                }
                res.status(200).json({
                    message: `Row with ID ${id} updated successfully in table ${tablename}`,
                });
            });
        }
        catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    });
}

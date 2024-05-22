import { Router } from "express";
const router = Router();
import * as tableController from "../controller/table-controller.js";
import * as dataController from "../controller/data-controller.js";
router.route("/createtable").post(tableController.createtable);
router.route("/gettables").get(tableController.getAllTables);
router
    .route("/getAttributes/:tableName")
    .get(tableController.gettTableAttributes);
router.route("/insertdata").post(dataController.InsertData);
router.route("/getdata/:tablename").get(dataController.getDatafromtable);
router.route("/deletedata/:tablename/:id").delete(dataController.deletedatafromtable);
router.route("/updatedata/:tablename/:id").put(dataController.updateDataInTable);
export default router;

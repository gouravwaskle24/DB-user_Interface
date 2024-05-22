import { getTablesAttributes, gettableData } from "helper/helper";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Attributes } from "./Tables/Attributes";
import EntityData from "./Entity-data";

type Props = {};

const EntityDetails = (props: Props) => {
  const [tableData, settableData] = useState({});
  const [rowData, setrowData] = useState([]);
  const location = useLocation();

  const table = location.state.table;

  useEffect(() => {
    const fetchData = async () => {
      const tableData = await getTablesAttributes(table);
      settableData(tableData);
    };

    const fetchrowData = async () => {
      const rowData: any = await gettableData(table);
      console.log("rowData", rowData);
      setrowData(rowData);
    };

    fetchData();

    fetchrowData();
  }, [table]);

  return (
    <main className="mx-5 mt-14 flex flex-col items-start justify-center gap-4  ">
      <div className="text-5xl font-bold capitalize ">{table}</div>
      <div className="font-semibold text-xl">Entity format</div>
      <Attributes attributes={tableData} />
      <EntityData table={table} tableData={tableData} rowData ={rowData} />


      {/* <Attributes attributes={tableData} /> */}
    </main>
  );
};

export default EntityDetails;

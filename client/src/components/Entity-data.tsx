import React from "react";
import { Button } from "./ui/button";
import { twMerge } from "tailwind-merge";
import { useModal } from "provider/ModalProvider";
import CustomModal from "./Custom-modal";
import CreateEntityForm from "./Forms/Create-entity-form";
import { PlusCircleIcon } from "lucide-react";
import AddDataForm from "./Forms/Add-data-form";
import { DataTable } from "./Tables/data-table";

type Props = {
  table: string;
  tableData: any;
  rowData: any;
};

const EntityData = ({ table, tableData, rowData }: Props) => {
  const { setOpen } = useModal();

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex">
        <Button
          className={twMerge(" flex gap-2")}
          onClick={() => {
            setOpen(
              <CustomModal
                title={`Insert data into ${table} entity`}
                subheading={`this will create new row into ${table} entity`}
              >
                <AddDataForm tablename={table} tableData={tableData} />
              </CustomModal>
            );
          }}
        >
          Add data
        </Button>
      </div>
      <DataTable data={rowData} tablename={table} />
    </section>
  );
};

export default EntityData;

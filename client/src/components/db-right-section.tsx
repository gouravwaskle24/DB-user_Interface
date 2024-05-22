import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import EntityDetails from "./Entity-details";

type Props = {};

const DBrightSideSection = (props: Props) => {
  const location = useLocation();

  const table = location.state?.table;
  return (
    <div className=" h-full  md:ml-[300px]  ">
      <Routes>
        <Route path="/:table" element={<EntityDetails />} />
      </Routes>

      {!table && (
        <main className="h-screen  flex flex-col  justify-center items-center gap-4 ">
          <div className=" text-7xl md:text-8xl font-bold ">
            Welcome to dashboard
          </div>
          <div>
            Select at least one entity ; if not created then create a new one
          </div>
        </main>
      )}
    </div>
  );
};

export default DBrightSideSection;

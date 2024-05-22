import LeftSideOptions from "components/Left-side-options";
import DBrightSideSection from "components/db-right-section";
import React from "react";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <main className="w-screen h-screen  ">
      
      <div>
        <LeftSideOptions defaultOpen={true} />
        <LeftSideOptions />
        <DBrightSideSection/>
      </div>

    </main>
  );
};

export default Dashboard;

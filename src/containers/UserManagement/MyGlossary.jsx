import React from "react";
import { useSelector } from "react-redux";
import { getOptions } from "utils";

import MUIDataTable from "mui-datatables";

const MyGlossary = () => {
  const apiStatus = useSelector((state) => state.apiStatus);

  return (
    <div>
      <MUIDataTable
        data={[]}
        columns={[]}
        options={getOptions(apiStatus.loading)}
      />
    </div>
  );
};

export default MyGlossary;

import React from "react";
import { tableTheme } from "theme";
import { getColumns, getOptions } from "utils";
import { onBoardingRequestColumns } from "config";
import { TableStyles } from "styles";

import { Button, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";

const OnboardingRequests = () => {
  const classes = TableStyles();

  const columns = getColumns(onBoardingRequestColumns);
  columns.push({
    name: "Action",
    label: "Action",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: () => {
        return (
          <div>
            <Button variant="text" className={classes.rejectBtn}>
              Reject
            </Button>

            <Button variant="outlined" className={classes.approveBtn}>
              Approve
            </Button>
          </div>
        );
      },
    },
  });

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable
        data={[{ "S No": 1 }]}
        columns={columns}
        options={getOptions()}
      />
    </ThemeProvider>
  );
};

export default OnboardingRequests;

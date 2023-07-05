import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getColumns, getOptions } from "utils";
import { usersColumns } from "config";

//Themes, Styles
import { tableTheme } from "theme";

//Icons
import PreviewIcon from "@mui/icons-material/Preview";

//Components
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";

const UserList = ({ data }) => {
  const apiStatus = useSelector((state) => state.apiStatus);

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: (_value, tableMeta) => {
        const { tableData, rowIndex } = tableMeta;
        const selectedRow = tableData[rowIndex];

        return (
          <Link
            to={`/profile/${selectedRow.id}`}
            style={{ textDecoration: "none" }}
          >
            <Tooltip title="View">
              <IconButton>
                <PreviewIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Link>
        );
      },
    },
  };

  const columns = [...getColumns(usersColumns), actionColumn];

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={data}
          columns={columns}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>
    </>
  );
};

export default UserList;

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

  const result = data.map((item, i) => {
    return [
      `${item.first_name} ${item.last_name}`,
      item.email,
      item.languages.join(", "),
      item.role,
      <Link to={`/profile/${item.id}`} style={{ textDecoration: "none" }}>
        <Tooltip title="View">
          <IconButton>
            <PreviewIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Link>,
    ];
  });

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={result}
          columns={getColumns(usersColumns)}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>
    </>
  );
};

export default UserList;

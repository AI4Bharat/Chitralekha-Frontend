import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Themes, Styles
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import tableTheme from "../../theme/tableTheme";

//Icons
import PreviewIcon from "@mui/icons-material/Preview";

//Components
import MUIDataTable from "mui-datatables";
import { getColumns, getOptions } from "../../utils/tableUtils";
import { usersColumns } from "../../config/tableColumns";

const UserList = ({ data }) => {
  const SearchProject = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const pageSearch = () => {
    return data.filter((el) => {
      if (SearchProject === "") {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.last_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.role?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
  };

  const result =
    data && data.length > 0
      ? pageSearch().map((item, i) => {
          return [
            `${item.first_name} ${item.last_name}`,
            item.email,
            item.role,
            <Link to={`/profile/${item.id}`} style={{ textDecoration: "none" }}>
              <Tooltip title="View">
                <IconButton>
                  <PreviewIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>,
          ];
        })
      : [];

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

import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider, Tooltip,IconButton, } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

//Components
import MUIDataTable from "mui-datatables";
import CustomButton from "../../common/Button";
import { Link } from "react-router-dom";

const UserList = ({ data }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const result = data.map((item) => {
      return [
        item.email,
        <Link
            to={`/profile/${item.id}`}
          style={{ textDecoration: "none" }}
        >
          <Tooltip title="View">
              <IconButton>
                <LibraryBooksIcon color="primary" />
              </IconButton>
            </Tooltip>
        </Link>,
      ];
    });

    setTableData(result);
  }, [data]);

  const columns = [
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px" },
        }),
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable data={tableData} columns={columns} options={options} />
    </ThemeProvider>
  );
};

export default UserList;

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Themes
import { ThemeProvider, Tooltip,IconButton,Box } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import PreviewIcon from '@mui/icons-material/Preview';

//Components
import MUIDataTable from "mui-datatables";
import Search from "../../common/Search";
import Loader from "../../common/Spinner";
import DatasetStyle from "../../styles/Dataset";


const UserList = ({ data }) => {
  const SearchProject = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const classes = DatasetStyle();

  const pageSearch = () => {
    return data.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }else if (
        el.last_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (el.email?.toLowerCase().includes(SearchProject?.toLowerCase())) {
        return el;
      } else if (
        el.role?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
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
        <Link
            to={`/profile/${item.id}`}
          style={{ textDecoration: "none" }}
        >
          <Tooltip title="View">
              <IconButton>
                <PreviewIcon color="primary" />
              </IconButton>
            </Tooltip>
        </Link>,
      ];
    }):[];

  const columns = [
    {
      name: "name",
      label: "Name",
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
      name: "role",
      label: "Role",
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

  const renderToolBar = () => {
    return (

      <Box className={classes.searchStyle}>
        <Search />
      </Box>
    );
  };

  const options = {
    textLabels: {
      body: {
        noMatch: apiStatus.progress ? <Loader /> : "No records",
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
    download: true,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: true,
    jumpToPage: true,
   // customToolbar: renderToolBar,
  };

  return (
    <>
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable data={result} columns={columns} options={options} />
    </ThemeProvider>
    </>
  );
};

export default UserList;

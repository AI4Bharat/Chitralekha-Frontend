import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Themes
import { ThemeProvider, Tooltip, IconButton, Box } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/TableStyles";

//Components
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";

//APIs
import FetchAllUsersAPI from "../../redux/actions/api/Admin/FetchAllUsers";
import APITransport from "../../redux/actions/apitransport/apitransport";
import Loader from "../../common/Spinner";

const MemberList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = TableStyles();

  const userList = useSelector((state) => state.getAllUserList.data);
  const searchList = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const apiObj = new FetchAllUsersAPI();
    dispatch(APITransport(apiObj));
    // eslint-disable-next-line
  }, []);

  const pageSearch = () => {
    return userList?.filter((el) => {
      if (searchList === "") {
        return el;
      } else if (
        el.username?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.organization?.title?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (el.email?.toLowerCase().includes(searchList?.toLowerCase())) {
        return el;
      } else if (
        el.role_label?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
  };

  const result =
    userList && userList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.id,
            `${item.first_name} ${item.last_name}`,
            item.organization,
            item.email,
            item.role_label,
          ];
        })
      : [];

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "excluded",
      },
    },
    {
      name: "first_name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "organization",
      label: "Organization",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
        customBodyRender: (value, tableMeta) => {
          return <Box sx={{ display: "flex" }}>{value?.title}</Box>;
        },
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
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "role_label",
      label: "Role",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
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
          className: classes.cellHeaderProps
        }),
        customBodyRender: (_value, tableMeta) => {
          return (
            <Box sx={{ display: "flex" }}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => navigate(`/profile/${tableMeta.rowData[0]}`)}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    },
  ];

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

export default MemberList;

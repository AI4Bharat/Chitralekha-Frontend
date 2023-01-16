import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Themes
import { ThemeProvider, Tooltip, IconButton, Box, Switch } from "@mui/material";
import tableTheme from "../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import Search from "../../common/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDialog from "../../common/DeleteDialog";

//APIs
import FetchAllUsersAPI from "../../redux/actions/api/Admin/FetchAllUsers";
import APITransport from "../../redux/actions/apitransport/apitransport";
import Loader from "../../common/Spinner";

const MemberList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.getAllUserList.data);
  const searchList = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToggle, setStatusToggle] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiObj = new FetchAllUsersAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const pageSearch = () => {
    return userList?.filter((el) => {
      if (searchList == "") {
        return el;
      } else if (
        el.username?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.organization.title?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (el.email?.toLowerCase().includes(searchList?.toLowerCase())) {
        return el;
      } else if (
        el.role_label?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const result =
    userList && userList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.id,
            item.username,
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
      name: "username",
      label: "Username",
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
      name: "organization",
      label: "Organization",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
        customBodyRender: (_value, tableMeta) => {
          return (
            <Box sx={{ display: "flex" }}>
              {/* <Tooltip title={statusToggle ? `Active` : `Inactive`}>
                <Switch
                  checked={statusToggle}
                  onChange={(event) => setStatusToggle(event.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Tooltip> */}

              <Tooltip title="Edit">
                <IconButton
                  onClick={() => navigate(`/profile/${tableMeta.rowData[0]}`)}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    setCurrentUserId(tableMeta.rowData[0]);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip> */}
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
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  const handleUserDelete = (id) => {};

  return (
    <>
      <Search />
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={result} columns={columns} options={options} />
      </ThemeProvider>

      {deleteDialogOpen && (
        <DeleteDialog
          openDialog={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          submit={() => handleUserDelete(currentUserId)}
          message={`Are you sure, you want to delete this User? All the associated videos, tasks, will be deleted.`}
          loading={loading}
        />
      )}
    </>
  );
};

export default MemberList;

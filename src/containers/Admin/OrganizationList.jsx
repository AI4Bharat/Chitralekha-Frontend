import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

//Themes
import tableTheme from "../../theme/tableTheme";

//Components
import { Box, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import Search from "../../common/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

//APIs
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrganizationListAPI from "../../redux/actions/api/Organization/FetchOrganizationList";
import DeleteDialog from "../../common/DeleteDialog";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orgList = useSelector((state) => state.getOrganizationList.data);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const apiObj = new FetchOrganizationListAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "excluded",
      },
    },
    {
      name: "title",
      label: "Organization",
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
      name: "organization_owner",
      label: "Organization Owner",
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
      name: "created_by",
      label: "Created By",
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
      name: "created_at",
      label: "Created At",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
        customBodyRender: (value) => {
          return (
            <div style={{ textTransform: "none" }}>
              {moment(value).format("DD/MM/YYYY hh:mm:ss")}
            </div>
          );
        },
      },
    },
    {
      name: "email_domain_name",
      label: "Email Domain Name",
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
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    navigate(
                      `/admin/edit-organization/${tableMeta.rowData[0]}`
                    );
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton onClick={() => setDeleteDialogOpen(true)}>
                  <DeleteIcon color="error" />
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

  const handleDelete = () => {};

  return (
    <>
      <Search />
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={orgList} columns={columns} options={options} />
      </ThemeProvider>

      {deleteDialogOpen && (
        <DeleteDialog
          openDialog={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          submit={() => handleDelete()}
          message={`Are you sure, you want to delete this Organization? All the associated videos, tasks, will be deleted.`}
        />
      )}
    </>
  );
};

export default OrganizationList;

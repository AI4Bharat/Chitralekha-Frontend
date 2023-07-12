import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getColumns, getOptions } from "utils";
import { adminOrgListColumns } from "config";

//Themes
import { tableTheme } from "theme";
import { TableStyles } from "styles";

//Components
import { Box, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteDialog } from "common";

//APIs
import {
  APITransport,
  DeleteOrganizationAPI,
  FetchOrganizationListAPI,
} from "redux/actions";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = TableStyles();

  const orgList = useSelector((state) => state.getOrganizationList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState("");

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "DELETE_ORGANIZATION") {
          getOrgList();
        }
      }

      setDeleteDialogOpen(false);
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const getOrgList = () => {
    const apiObj = new FetchOrganizationListAPI();
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    getOrgList();
    // eslint-disable-next-line
  }, []);

  const columns = getColumns(adminOrgListColumns);
  columns.push({
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      setCellHeaderProps: () => ({
        className: classes.cellHeaderProps,
      }),
      customBodyRender: (_value, tableMeta) => {
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  navigate(`/admin/edit-organization/${tableMeta.rowData[0]}`);
                }}
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setCurrentOrgId(tableMeta.rowData[0]);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  });

  const handleDelete = async (currentOrgId) => {
    const apiObj = new DeleteOrganizationAPI(currentOrgId);
    dispatch(APITransport(apiObj));
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={orgList}
          columns={columns}
          options={getOptions(apiStatus.loading)}
        />
      </ThemeProvider>

      {deleteDialogOpen && (
        <DeleteDialog
          openDialog={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          submit={() => handleDelete(currentOrgId)}
          message={`Are you sure, you want to delete this Organization? All the associated videos, tasks, will be deleted.`}
          loading={apiStatus.loading}
        />
      )}
    </>
  );
};

export default OrganizationList;

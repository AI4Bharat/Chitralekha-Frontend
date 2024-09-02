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
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DeleteDialog } from "common";

//APIs
import {
  APITransport,
  ArchiveOrganizationAPI,
  UnarchiveOrganizationAPI,
  FetchOrganizationListAPI,
  DeleteOrganizationAPI,
} from "redux/actions";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = TableStyles();

  const orgList = useSelector((state) => state.getOrganizationList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "ARCHIVE_ORGANIZATION" || apiType === "UNARCHIVE_ORGANIZATION") {
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

  const handleArchiveUnarchive = async () => {
    setIsArchived(false)
    setDialogOpen(false)
  };
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

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
        const rowIndex = tableMeta.rowIndex;
        const archived = orgList[rowIndex]?.archived || false; 
     
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title="View">
              <IconButton
                onClick={() => {
                  navigate(`/my-organization/${orgList[rowIndex]?.id}`);
                }}
                // disabled={archived}
              >
                <VisibilityIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  navigate(`/admin/edit-organization/${orgList[rowIndex]?.id}`);
                }}
                // disabled={archived}
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setCurrentOrgId(tableMeta.rowData[0]);
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip> */}

            {/* <Tooltip title={archived ? "Unarchive" : "Archive"}>
              <IconButton
                onClick={() => {
                  setDialogOpen(true);
                  setCurrentOrgId(orgList[rowIndex]?.id);
                  setIsArchived(archived);
                }}
              >
                {archived ? (
                  <UnarchiveIcon color="error" />
                ) : (
                  <ArchiveIcon color="warning" />
                )}
              </IconButton>
            </Tooltip> */}
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

      {deleteDialogOpen  && (
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


{/* <DeleteDialog
          openDialog={dialogOpen}
          handleClose={() => setDialogOpen(false)}
          submit={handleArchiveUnarchive}
          message={`Are you sure you want to ${isArchived ? "unarchive" : "archive"} this organization?`}
          loading={apiStatus.loading}
          confirmText={isArchived ? "Unarchive" : "Archive"}
          closeText="Close"
        /> */}
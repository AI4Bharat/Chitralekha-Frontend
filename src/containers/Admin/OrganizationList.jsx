import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getColumns, getOptions } from "../../utils/tableUtils";
import { adminOrgListColumns } from "../../config/tableColumns";

//Themes
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/tableStyles";

//Components
import { Box, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDialog from "../../common/DeleteDialog";

//APIs
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrganizationListAPI from "../../redux/actions/api/Organization/FetchOrganizationList";
import DeleteOrganizationAPI from "../../redux/actions/api/Organization/DeleteOrganization";
import CustomizedSnackbars from "../../common/Snackbar";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = TableStyles();

  const orgList = useSelector((state) => state.getOrganizationList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [loading, setLoading] = useState(false);

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

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const handleDelete = async (currentOrgId) => {
    const apiObj = new DeleteOrganizationAPI(currentOrgId);
    setLoading(true);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "DELETE",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      setLoading(false);
      setDeleteDialogOpen(false);
      getOrgList();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      {renderSnackBar()}

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={orgList}
          columns={columns}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>

      {deleteDialogOpen && (
        <DeleteDialog
          openDialog={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          submit={() => handleDelete(currentOrgId)}
          message={`Are you sure, you want to delete this Organization? All the associated videos, tasks, will be deleted.`}
          loading={loading}
        />
      )}
    </>
  );
};

export default OrganizationList;

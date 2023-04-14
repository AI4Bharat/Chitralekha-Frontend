import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

//Themes
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/TableStyles";

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
import Loader from "../../common/Spinner";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = TableStyles();

  const orgList = useSelector((state) => state.getOrganizationList.data);
  const searchList = useSelector((state) => state.searchList.data);
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

  const pageSearch = () => {
    return orgList?.filter((el) => {
      if (searchList === "") {
        return el;
      } else if (el.title?.toLowerCase().includes(searchList?.toLowerCase())) {
        return el;
      } else if (
        el.created_by.first_name
          ?.toLowerCase()
          .includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.created_by.last_name
          ?.toLowerCase()
          .includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.organization_owner?.first_name
          ?.toLowerCase()
          .includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.organization_owner?.last_name
          ?.toLowerCase()
          .includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email_domain_name?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
  };

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
          className: classes.cellHeaderProps
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
          className: classes.cellHeaderProps
        }),
        customBodyRender: (value) => {
          return <Box>{`${value?.first_name} ${value?.last_name}`}</Box>;
        },
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
          className: classes.cellHeaderProps
        }),
        customBodyRender: (value, tableMeta) => {
          return <Box>{`${value?.first_name} ${value?.last_name}`}</Box>;
        },
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
          className: classes.cellHeaderProps
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

  const result =
    orgList && orgList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.id,
            item.title,
            item.organization_owner,
            item.created_by,
            item.created_at,
            item.email_domain_name,
          ];
        })
      : [];

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
        <MUIDataTable data={result} columns={columns} options={options} />
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

import React from "react";

//Themes
import {
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
  IconButton,
} from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

//Components
import CustomButton from "../../common/Button";
import MUIDataTable from "mui-datatables";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import DeleteProjectAPI from "../../redux/actions/api/Project/DeleteProject";
import APITransport from "../../redux/actions/apitransport/apitransport";
import CustomizedSnackbars from "../../common/Snackbar";
import { roles } from "../../utils/utils";

const ProjectList = ({ data, props, removeProjectList }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [projectid, setprojectid] = useState([]);
  const [open, setOpen] = useState(false);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const userData = useSelector((state) => state.getLoggedInUserDetails.data)

  const handleok = async (id) => {
    setOpen(false);
    console.log("project ID ------- ", id);
    const apiObj = new DeleteProjectAPI(id);
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
      removeProjectList();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = (id) => {
    setOpen(true);
    setprojectid(id);
  };

  useEffect(() => {
    const result = data.map((item) => {
      return [
        item.title,
        item.managers[0]?.email,
        item.created_by?.username,
        <div style={{ textAlign: "center" }}>
          <Link
            to={`/my-organization/${id}/project/${item.id}`}
            style={{ textDecoration: "none" }}
          >
            <Tooltip title="View">
              <IconButton>
                <LibraryBooksIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Link>

          {roles.filter((role)=>role.value === userData?.role)[0]?.permittedToDeleteProject && <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon
                color="error"
                onClick={() => handleDeleteProject(item.id)}
              />
            </IconButton>
          </Tooltip>}
        </div>,
      ];
    });

    setTableData(result);
  }, [data]);

  const columns = [
    {
      name: "title",
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
      name: "Manager",
      label: "Manager",
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
      name: "createdBy",
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
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", textAlign: "center" },
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

  const renderDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure, you want to delete this project? All the associated
            video and tasks will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleClose} label="Cancel" />
          <CustomButton
            onClick={() => handleok(projectid)}
            label="Ok"
            autoFocus
          />
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={tableData} columns={columns} options={options} />
      </ThemeProvider>
      {renderSnackBar()}
      {renderDialog()}
    </>
  );
};

export default ProjectList;

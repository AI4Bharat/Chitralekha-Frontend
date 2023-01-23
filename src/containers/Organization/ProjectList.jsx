import React from "react";

//Themes
import tableTheme from "../../theme/tableTheme";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";

//Components
import {
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import CustomButton from "../../common/Button";
import MUIDataTable from "mui-datatables";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import DeleteProjectAPI from "../../redux/actions/api/Project/DeleteProject";
import CustomizedSnackbars from "../../common/Snackbar";
import Search from "../../common/Search";
import moment from "moment/moment";
import Loader from "../../common/Spinner";
import DeleteDialog from "../../common/DeleteDialog";
import DatasetStyle from "../../styles/Dataset";

const ProjectList = ({ data, removeProjectList }) => {
  const { id } = useParams();
  const classes = DatasetStyle();
  const [projectid, setprojectid] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const SearchProject = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const handleok = async (id) => {
    setLoading(true);
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
      setLoading(false);
      setOpen(false);
      removeProjectList();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = (id) => {
    setOpen(true);
    setprojectid(id);
  };

  const pageSearch = () => {
    return data?.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.managers?.some((val) =>
          val.email?.toLowerCase().includes(SearchProject?.toLowerCase())
        )
      ) {
        return el;
      } else if (
        el.created_by?.username
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const result =
    data && data.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.title,
            item.managers[0]?.email,
            moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
            item.created_by?.username,
            <div style={{ textAlign: "center" }}>
              <Link
                to={`/my-organization/${id}/project/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Tooltip title="View">
                  <IconButton>
                    <PreviewIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Link>

              <Tooltip title="Delete">
                <IconButton onClick={() => handleDeleteProject(item.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </div>,
          ];
        })
      : [];

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
      name: "createdAt",
      label: "Created At",
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
    search: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
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

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={result} columns={columns} options={options} />
      </ThemeProvider>
      {renderSnackBar()}

      {open && (
        <DeleteDialog
          openDialog={open}
          handleClose={() => handleClose()}
          submit={() => handleok(projectid)}
          loading={loading}
          message={`Are you sure, you want to delete this project? All the associated
          video and tasks will be deleted.`}
        />
      )}
    </>
  );
};

export default ProjectList;
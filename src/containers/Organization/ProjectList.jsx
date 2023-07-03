import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import { Link, useParams } from "react-router-dom";
import moment from "moment/moment";
import { projectColumns } from "config";

//Themes
import { tableTheme } from "theme";

//Icons
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";

//Components
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { CustomizedSnackbars, DeleteDialog } from "common";

//APIs
import DeleteProjectAPI from "redux/actions/api/Project/DeleteProject";

const ProjectList = ({ data, removeProjectList }) => {
  const { id } = useParams();

  const [projectid, setprojectid] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

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

  const result = data.map((item, i) => {
    return [
      item.title,
      item.managers[0]?.email,
      moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
      `${item.created_by?.first_name} ${item.created_by?.last_name}`,
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

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={result}
          columns={getColumns(projectColumns)}
          options={getOptions(apiStatus.progress)}
        />
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

import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import { Link, useParams } from "react-router-dom";
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

    try {
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
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!",
        variant: "error",
      });
    } finally {
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

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: (_value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];

        return (
          <div style={{ textAlign: "center" }}>
            <Link
              to={`/my-organization/${id}/project/${selectedRow.id}`}
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="View">
                <IconButton>
                  <PreviewIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>

            <Tooltip title="Delete">
              <IconButton onClick={() => handleDeleteProject(selectedRow.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  };

  const columns = [...getColumns(projectColumns), actionColumn];

  const renderSnackBar = useCallback(() => {
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
  }, [snackbar]);

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={data}
          columns={columns}
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

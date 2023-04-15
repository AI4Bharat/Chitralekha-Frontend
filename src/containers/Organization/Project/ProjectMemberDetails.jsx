import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Themes
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../../common/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteDialog from "../../../common/DeleteDialog";

//APIs
import RemoveProjectMemberAPI from "../../../redux/actions/api/Project/RemoveProjectMember";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import FetchProjectMembersAPI from "../../../redux/actions/api/Project/FetchProjectMembers";
import DeleteMemberErrorDialog from "../../../common/DeleteMemberErrorDialog";
import { getColumns, getOptions } from "../../../utils/tableUtils";
import { usersColumns } from "../../../config/tableColumns";

const ProjectMemberDetails = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [openMemberErrorDialog, setOpenMemberErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const projectMembersList = useSelector(
    (state) => state.getProjectMembers.data
  );

  const SearchProject = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const projectDetails = useSelector((state) => state.getProjectDetails.data);

  const removeProjectMember = async (id) => {
    setLoading(true);

    const apiObj = new RemoveProjectMemberAPI(projectId, id);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
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
      setOpenDeleteDialog(false);
      setLoading(false);
      getProjectMembers();
    } else {
      setErrorResponse(resp.response);
      setErrorMessage(resp.message);
      setOpenMemberErrorDialog(true);
      setOpenDeleteDialog(false);
      setLoading(false);
    }
  };

  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectMembers();
    // eslint-disable-next-line
  }, []);

  const pageSearch = () => {
    return projectMembersList.filter((el) => {
      if (SearchProject === "") {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.last_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
  };
  const result =
    projectMembersList && projectMembersList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            `${item.first_name} ${item.last_name}`,
            item.email,
            item.role,
            // item.availability_status,
            //roles.map((value) => (value.id === item.role ? value.type : "")),
            <Box sx={{ display: "flex" }}>
              <Tooltip title="View">
                <IconButton>
                  <Link
                    to={`/profile/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <PreviewIcon color="primary" sx={{ mt: "10px" }} />
                  </Link>
                </IconButton>
              </Tooltip>

              {(projectDetails?.managers?.some(
                (item) => item.id === userData.id
              ) ||
                userData.role === "ORG_OWNER") && (
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => {
                      setMemberId(item.id);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>,
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

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={result}
          columns={getColumns(usersColumns)}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>
      
      {renderSnackBar()}

      {openDeleteDialog && (
        <DeleteDialog
          openDialog={openDeleteDialog}
          handleClose={() => setOpenDeleteDialog(false)}
          submit={() => removeProjectMember(memberId)}
          loading={loading}
          message={`Are you sure, you want to delete this member?`}
        />
      )}

      {openMemberErrorDialog && (
        <DeleteMemberErrorDialog
          openDialog={openMemberErrorDialog}
          handleClose={() => setOpenMemberErrorDialog(false)}
          message={errorMessage}
          response={errorResponse}
        />
      )}
    </>
  );
};

export default ProjectMemberDetails;

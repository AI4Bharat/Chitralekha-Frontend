import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import { usersColumns } from "config";

//Themes
import { tableTheme } from "theme";

//Components
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { DeleteDialog, DeleteMemberErrorDialog } from "common";

//APIs
import {
  APITransport,
  FetchProjectMembersAPI,
  RemoveProjectMemberAPI,
} from "redux/actions";

const ProjectMemberDetails = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [openMemberErrorDialog, setOpenMemberErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [orgOwnerId, setOrgOwnerId] = useState("");

  const projectMembersList = useSelector(
    (state) => state.getProjectMembers.data
  );

  const apiStatus = useSelector((state) => state.apiStatus);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const projectDetails = useSelector((state) => state.getProjectDetails.data);
  const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      const {
        organization: { organization_owners },
      } = userData;
  
      if (organization_owners && organization_owners.length > 0) {
        const ownerIds = organization_owners.map(owner => owner.id);
        setOrgOwnerId(ownerIds);

        if (ownerIds.includes(userData.id)) {
          setIsUserOrgOwner(true);
        } else {
          setIsUserOrgOwner(false);
        }
      }
    }
  }, [userData]);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "REMOVE_PROJECT_MEMBER") {
          getProjectMembers();
        }
      } else {
        if (apiType === "REMOVE_PROJECT_MEMBER") {
          setErrorResponse(data.response);
          setErrorMessage(data.message);
          setOpenMemberErrorDialog(true);
        }
      }

      setOpenDeleteDialog(false);
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const removeProjectMember = async (id) => {
    const apiObj = new RemoveProjectMemberAPI(projectId, id);
    dispatch(APITransport(apiObj));
  };

  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectMembers();
    // eslint-disable-next-line
  }, []);

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: (_value, tableMeta) => {
        const { tableData, rowIndex } = tableMeta;
        const selectedRow = tableData[rowIndex];

        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title="View">
              <IconButton>
                <Link
                  to={`/profile/${selectedRow.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <PreviewIcon color="primary" sx={{ mt: "10px" }} />
                </Link>
              </IconButton>
            </Tooltip>

            {(projectDetails?.managers?.some(
              (item) => item.id === userData.id
            ) ||
              isUserOrgOwner  || userData?.role==="ADMIN" )&& (
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    setMemberId(selectedRow.id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  };

  const columns = [...getColumns(usersColumns), actionColumn];

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={projectMembersList}
          columns={columns}
          options={getOptions(apiStatus.loading)}
        />
      </ThemeProvider>

      {openDeleteDialog && (
        <DeleteDialog
          openDialog={openDeleteDialog}
          handleClose={() => setOpenDeleteDialog(false)}
          submit={() => removeProjectMember(memberId)}
          loading={apiStatus.loading}
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

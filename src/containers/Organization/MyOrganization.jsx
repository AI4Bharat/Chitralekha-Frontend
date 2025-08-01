//My Organization
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "utils";

//APIs
import {
  APITransport,
  AddOrganizationMemberAPI,
  FetchOrganizatioUsersAPI,
  FetchOrganizationDetailsAPI,
  UploadCSVAPI,
  ProjectListAPI,
  setSnackBar,
} from "redux/actions";

//Styles
import { DatasetStyle } from "styles";
import {  useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

//Components
import {
  Box,
  Card,
  Grid,
  Tab,
  Tabs,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import UserList from "./UserList";
import OrganizationSettings from "./OrganizationSettings";
import OrganizationReport from "./OrganizationReport";
import ProjectList from "./ProjectList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AddOrganizationMember, AlertComponent, Loader } from "common";
import UploadFileDialog from "common/UploadFileDialog";
import RegenerateFailedVotrTasksDialog from "common/RegenerateFailedVotrTasksDialog";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const MyOrganization = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [newMemberName, setNewMemberName] = useState([]);
  const [newMemberRole, setNewMemberRole] = useState("");
  const [showCSVAlert, setShowCSVAlert] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColumn, setAlertColumn] = useState([]);
  const [orgOwnerId, setOrgOwnerId] = useState("");
  const [openUploadBulkVideoDialog, setOpenUploadBulkVideoDialog] =
    useState(false);
    const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);
  const [openRegenerateFailedVotrTasksDialog, setOpenRegenerateFailedVotrTasksDialog] = useState(false);

  const organizationDetails = useSelector(
    (state) => state.getOrganizationDetails.data
  );
  const projectList = useSelector((state) => state.getProjectList.data);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const usersList = useSelector((state) => state.getOrganizatioUsers.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "UPLOAD_CSV") {
          setOpenUploadBulkVideoDialog(false);
          setOpenRegenerateFailedVotrTasksDialog(false);
        }

        if (apiType === "GET_USERS_ROLES") {
          setNewMemberName([]);
          setNewMemberRole("");
          getOrganizatioUsersList();
        }
      } else {
        if (apiType === "UPLOAD_CSV") {
          dispatch(setSnackBar({ open: false }));
          setShowCSVAlert(true);
          setAlertData(data.response);
          setAlertMessage(data.message);
          setAlertColumn("csvAlertColumns");
          setOpenUploadBulkVideoDialog(false);
          setOpenRegenerateFailedVotrTasksDialog(false);
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const getOrganizationDetails = () => {
    const userObj = new FetchOrganizationDetailsAPI(id);
    dispatch(APITransport(userObj));
  };

  const getProjectList = (orgId) => {
    const userObj = new ProjectListAPI(orgId);
    dispatch(APITransport(userObj));
  };

  const getOrganizatioUsersList = () => {
    const userObj = new FetchOrganizatioUsersAPI(id);
    dispatch(APITransport(userObj));
  };
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));


  useEffect(() => {
    getOrganizationDetails();
    getOrganizatioUsersList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    userData?.organization?.id && getProjectList(userData?.organization?.id);

    if (userData && userData.id) {
      const {
        organization: { organization_owners },
      } = userData;

      if (organization_owners && organization_owners?.length > 0) {
        const ownerIds = organization_owners.map((owner) => owner.id);
        setOrgOwnerId(ownerIds);

        if (ownerIds.includes(userData.id)) {
          setIsUserOrgOwner(true);
        } else {
          setIsUserOrgOwner(false);
        }
      }
    }
    // eslint-disable-next-line
  }, [userData]);

  const addNewMemberHandler = async () => {
    const data = {
      role: newMemberRole,
      emails: newMemberName,
      organization_id: id,
    };
    const apiObj = new AddOrganizationMemberAPI(data);
    dispatch(APITransport(apiObj));
  };

  const renderOrgDetails = () => {
    if (!organizationDetails || organizationDetails.length <= 0) {
      return <Loader />;
    }

    return (
      <Typography
        variant="h2"
        gutterBottom
        component="div"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {organizationDetails?.title}
      </Typography>
    );
  };

  const handeFileUpload = (file, regenerate = false) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result;
      const csv = btoa(csvData);

      const uploadCSVObj = new UploadCSVAPI("org", id, csv, regenerate);
      dispatch(APITransport(uploadCSVObj));
    };
    reader.readAsBinaryString(file[0]);
  };

  return (
    <Grid container direction="row">
      <Card className={classes.workspaceCard}>

        <Box>
          <Tabs
            style={{ marginLeft: "1.5rem" }}
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            variant="fullWidth"
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
            
            orientation={isSmallScreen ? "vertical" : "horizontal"}
          >
            <Tab
              label={"Projects"}
              sx={{
                fontSize: 16,
                fontWeight: "700",
                bgcolor: value === 0 ? "#d3d3d3" : "#F5F5F5",
                color: value === 0 ? "black" : "text.primary",
                margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",

                borderRadius: 1,
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            />

            {roles.filter((role) => role.value === userData?.role)[0]
              ?.canAddMembers && (
              <Tab
                label={"Members"}
                sx={{
                  fontSize: 16,
                  fontWeight: "700",
                  bgcolor: value === 1 ? "#d3d3d3" : "#F5F5F5",
                  margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",

                  color: value === 1 ? "black" : "text.primary",
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                  },
                }}
              />
            )}

            {(isUserOrgOwner || userData?.role === "ADMIN") && (
              <Tab
                label={"Reports"}
                sx={{
                  fontSize: 16,
                  fontWeight: "700",
                  bgcolor: value === 2 ? "#d3d3d3" : "#F5F5F5",
                  color: value === 2 ? "black" : "text.primary",
                  margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",

                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                  },
                }}
              />
            )}

            {(isUserOrgOwner || userData?.role === "ADMIN") && (
              <Tab
                label={"Settings"}
                sx={{
                  fontSize: 16,
                  fontWeight: "700",
                  bgcolor: value === 3 ? "#d3d3d3" : "#F5F5F5",
                  color: value === 3 ? "black" : "text.primary",
                  margin: isSmallScreen ? "0 0 1rem 0" : "0 1rem 0 0",
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                  },
                }}
              />
            )}
          </Tabs>
        </Box>

        <TabPanel
          value={value}
          index={0}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <Box display={"flex"} width={"100%"} flexDirection={{xs:'Column',lg:"Row"}} gap={1}
            >
              {(isUserOrgOwner ||
                userData?.role === "ADMIN" ||
                userData?.role === "PROJECT_MANAGER") && (
                <Fragment>
                  <Button
                    style={{ marginRight: "10px" }}
                    className={classes.projectButton}
                    onClick={() =>
                      navigate(`/my-organization/${id}/create-new-project`)
                    }
                    variant="contained"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem"},
                      minWidth: { xs: "150px", sm: "150px", md: "150px" },
                    }}
                  >
                    Add New Project
                  </Button>
                  <Button
                    style={{ marginRight: "10px" }}
                    className={classes.projectButton}
                    onClick={() => setOpenRegenerateFailedVotrTasksDialog(true)}
                    variant="contained"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      minWidth: { xs: "200px", sm: "150px", md: "150px" },
                    }}
                  >
                    Regenerate Failed VOTR Tasks
                    <Tooltip title="Download sample CSV">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.assign(`/RegenrateSamplefile.csv`);
                        }}
                        sx={{ color: "white" }}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Button>

                  <Button
                    className={classes.projectButton}
                    onClick={() =>
                      navigate(`/my-organization/${id}/create-bulk-projects`)
                    }
                    variant="contained"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
                      minWidth: { xs: "200px", sm: "150px", md: "150px" },
                    }}
                  >
                    Create Bulk Projects from Template
                  </Button>

                  {organizationDetails.enable_upload && (
                    <Button
                      className={classes.projectButton}
                      variant="contained"
                      onClick={() => setOpenUploadBulkVideoDialog(true)}
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        minWidth: { xs: "150px", sm: "150px", md: "150px" },
                      }}
                    >
                      Bulk Video Upload
                      <Tooltip title="Download sample CSV">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.assign(`/SampleBulkupload.csv`);
                        }}
                        sx={{ color: "white" }}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    </Button>
                  )}
                </Fragment>
              )}
            </Box>
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <ProjectList
                data={projectList}
                removeProjectList={() =>
                  getProjectList(userData?.organization?.id)
                }
              />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={1}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            {(isUserOrgOwner || userData?.role === "ADMIN") && (
              <Button
                className={classes.projectButton}
                onClick={() => setAddUserDialog(true)}
                variant="contained"
              >
                Add New Member
              </Button>
            )}

            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList data={usersList} />
            </div>
          </Box>
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <OrganizationReport />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={3}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <OrganizationSettings />
        </TabPanel>
      </Card>

      {addUserDialog && (
        <AddOrganizationMember
          open={addUserDialog}
          handleUserDialogClose={() => setAddUserDialog(false)}
          title={"Add New Members"}
          textFieldLabel={"Enter Email Id of Member"}
          textFieldValue={newMemberName}
          handleTextField={setNewMemberName}
          addBtnClickHandler={addNewMemberHandler}
          selectFieldValue={newMemberRole}
          handleSelectField={setNewMemberRole}
        />
      )}

      {showCSVAlert && (
        <AlertComponent
          open={showCSVAlert}
          onClose={() => setShowCSVAlert(false)}
          message={alertMessage}
          report={alertData}
          columns={alertColumn}
        />
      )}

      {openUploadBulkVideoDialog && (
        <UploadFileDialog
          openDialog={openUploadBulkVideoDialog}
          handleClose={() => setOpenUploadBulkVideoDialog(false)}
          title={"Upload Bulk Videos"}
          handleSubmit={handeFileUpload}
        />
      )}

      {openRegenerateFailedVotrTasksDialog && (
        <RegenerateFailedVotrTasksDialog
          openDialog={openRegenerateFailedVotrTasksDialog}
          handleClose={() => setOpenRegenerateFailedVotrTasksDialog(false)}
          title={"Regenerate Failed VOTR Tasks"}
          handleSubmit={handeFileUpload}
        />
      )}
    </Grid>
  );
};

export default MyOrganization;

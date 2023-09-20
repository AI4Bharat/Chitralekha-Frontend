//My Organization
import { Fragment, useEffect, useRef, useState } from "react";
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
  const csvUpload = useRef();

  const [value, setValue] = useState(0);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [newMemberName, setNewMemberName] = useState([]);
  const [newMemberRole, setNewMemberRole] = useState("");
  const [showCSVAlert, setShowCSVAlert] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColumn, setAlertColumn] = useState([]);

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

  useEffect(() => {
    getOrganizationDetails();
    getOrganizatioUsersList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    userData?.organization?.id && getProjectList(userData?.organization?.id);
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
      <Typography variant="h2" gutterBottom component="div">
        {organizationDetails?.title}
      </Typography>
    );
  };

  const handeFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result;
      const csv = btoa(csvData);

      const uploadCSVObj = new UploadCSVAPI("org", id, csv);
      dispatch(APITransport(uploadCSVObj));
    };
    reader.readAsBinaryString(file[0]);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        {renderOrgDetails()}

        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label={"Projects"} sx={{ fontSize: 16, fontWeight: "700" }} />

            {roles.filter((role) => role.value === userData?.role)[0]
              ?.canAddMembers && (
              <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            )}

            {roles.filter((role) => role.value === userData?.role)[0]
              ?.orgSettingVisible && (
              <Tab label={"Reports"} sx={{ fontSize: 16, fontWeight: "700" }} />
            )}

            {roles.filter((role) => role.value === userData?.role)[0]
              ?.orgSettingVisible && (
              <Tab
                label={"Settings"}
                sx={{ fontSize: 16, fontWeight: "700" }}
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
            <Box display={"flex"} width={"100%"}>
              {userData?.role === "ORG_OWNER" && (
                <Fragment>
                  <Button
                    style={{ marginRight: "10px" }}
                    className={classes.projectButton}
                    onClick={() =>
                      navigate(`/my-organization/${id}/create-new-project`)
                    }
                    variant="contained"
                  >
                    Add New Project
                  </Button>

                  {organizationDetails.enable_upload && (
                    <Button
                      style={{ marginLeft: "10px" }}
                      className={classes.projectButton}
                      variant="contained"
                      onClick={() => csvUpload.current.click()}
                    >
                      Bulk Video Upload
                      <Tooltip title="Download sample CSV">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.assign(
                              `https://chitralekhadev.blob.core.windows.net/multimedia/SampleInputOrgUpload.csv`
                            );
                          }}
                          sx={{ color: "white" }}
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={csvUpload}
                        accept=".csv"
                        onChange={(event) => {
                          handeFileUpload(event.target.files);
                          event.target.value = null;
                        }}
                      />
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
            <Button
              className={classes.projectButton}
              onClick={() => setAddUserDialog(true)}
              variant="contained"
            >
              Add New Member
            </Button>

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
    </Grid>
  );
};

export default MyOrganization;

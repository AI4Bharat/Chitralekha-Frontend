//My Organization
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { roles } from "../../utils/utils";

//APIs
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import ProjectListAPI from "../../redux/actions/api/Project/ProjectList";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrganizatioUsersAPI from "../../redux/actions/api/Organization/FetchOrganizatioUsers";
import AddOrganizationMemberAPI from "../../redux/actions/api/Organization/AddOrganizationMember";

//Styles
import DatasetStyle from "../../styles/datasetStyle";

//Components
import { Box, Card, Grid, Tab, Tabs, Typography, Button } from "@mui/material";
import UserList from "./UserList";
import AddOrganizationMember from "../../common/AddOrganizationMember";
import CustomizedSnackbars from "../../common/Snackbar";
import Loader from "../../common/Spinner";
import OrganizationSettings from "./OrganizationSettings";
import OrganizationReport from "./OrganizationReport";
import ProjectList from "./ProjectList";

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
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const organizationDetails = useSelector(
    (state) => state.getOrganizationDetails.data
  );
  const projectList = useSelector((state) => state.getProjectList.data);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const usersList = useSelector((state) => state.getOrganizatioUsers.data);

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
      emails: [newMemberName],
      organization_id: id,
    };
    const apiObj = new AddOrganizationMemberAPI(data);
    // dispatch(APITransport(apiObj));
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
      getOrganizatioUsersList();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
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

  const renderOrgDetails = () => {
    if (!organizationDetails || organizationDetails.length <= 0) {
      return <Loader />;
    }

    return (
      <>
        <Typography variant="h2" gutterBottom component="div">
          {organizationDetails?.title}
        </Typography>

        {/* <Typography variant="body1" gutterBottom component="div">
          Created by : {`${organizationDetails?.created_by?.first_name}`}
        </Typography> */}
      </>
    );
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
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
            {userData?.role === "ORG_OWNER" && (
              <Button
                className={classes.projectButton}
                onClick={() =>
                  navigate(`/my-organization/${id}/create-new-project`)
                }
                variant="contained"
              >
                Add New Project
              </Button>
            )}
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
    </Grid>
  );
};

export default MyOrganization;

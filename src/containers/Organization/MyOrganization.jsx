//My Organization
import { useEffect, useState } from "react";

//APIs
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import ProjectListAPI from "../../redux/actions/api/Project/ProjectList";
import FetchUserListAPI from "../../redux/actions/api/User/FetchUserList";
import ProjectList from "./ProjectList";
import EditOrganizationDetailsAPI from "../../redux/actions/api/Organization/EditOrganizationDetails";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchUserRolesAPI from "../../redux/actions/api/User/FetchUsersRoles";
import FetchLoggedInUserDataAPI from "../../redux/actions/api/User/FetchLoggedInUserDetails";
import FetchOrganizatioUsersAPI from "../../redux/actions/api/Organization/FetchOrganizatioUsers";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//Styles
import DatasetStyle from "../../styles/Dataset";

//Components
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import Button from "../../common/Button";
import UserList from "./UserList";
import OutlinedTextField from "../../common/OutlinedTextField";
import AddOrganizationMember from "../../common/AddOrganizationMember";
import AddOrganizationMemberAPI from "../../redux/actions/api/Organization/AddOrganizationMember";
import CustomizedSnackbars from "../../common/Snackbar";
import { roles } from "../../utils/utils";

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
  const [organizationName, setOrganizationName] = useState("");
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
  //const userList = useSelector((state) => state.getUserList.data);

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const usersList = useSelector((state) => state.getOrganizatioUsers.data);

  const getOrganizationDetails = () => {
    const userObj = new FetchOrganizationDetailsAPI(id);
    dispatch(APITransport(userObj));
  };

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI();
    dispatch(APITransport(loggedInUserObj));
  };

  const getProjectList = (orgId) => {
    const userObj = new ProjectListAPI(orgId);
    dispatch(APITransport(userObj));
  };

  const getUserList = () => {
    const userObj = new FetchUserListAPI();
    dispatch(APITransport(userObj));
  };
  const getOrganizatioUsersList = () => {
    const userObj = new FetchOrganizatioUsersAPI(id);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getOrganizationDetails();
    getUserList();
    // getLoggedInUserData()
    getOrganizatioUsersList();
  }, []);

  useEffect(() => {
    userData?.organization?.id && getProjectList(userData?.organization?.id);
  }, [userData]);

  useEffect(() => {
    setOrganizationName(organizationDetails?.title);
  }, [organizationDetails]);

  const handleOrganizationUpdate = async () => {
    const userObj = new EditOrganizationDetailsAPI(
      id,
      organizationName,
      organizationDetails?.email_domain_name
    );
    //dispatch(APITransport(userObj));
    const res = await fetch(userObj.apiEndPoint(), {
      method: "PUT",
      body: JSON.stringify(userObj.getBody()),
      headers: userObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

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

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          {organizationDetails?.title}
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
          Created by : {organizationDetails?.created_by}
        </Typography>

        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label={"Projects"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />

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
                label={"Add New Project"}
                onClick={() =>
                  navigate(`/my-organization/${id}/create-new-project`)
                }
              />
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

        {/* <TabPanel
          value={value}
          index={1}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
        <Typography>No records to be fetched</Typography></TabPanel>

        <TabPanel
          value={value}
          index={2}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
        <Typography>No records to be updated</Typography></TabPanel> */}

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
              label={"Add New Member"}
              onClick={() => setAddUserDialog(true)}
            />
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
          <Typography variant="h4">Edit Organization</Typography>
          <OutlinedTextField
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            sx={{ width: "100%", mt: 5 }}
            placeholder="Organization Name..."
          />
          <Button
            label={"Change"}
            onClick={() => handleOrganizationUpdate()}
            sx={{ mt: 5, width: "100%" }}
          />
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

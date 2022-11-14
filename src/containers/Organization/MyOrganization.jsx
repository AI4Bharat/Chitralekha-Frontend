//My Organization
import { useEffect, useState } from "react";

//APIs
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import ProjectListAPI from "../../redux/actions/api/Project/ProjectList";
import FetchUserListAPI from "../../redux/actions/api/User/FetchUserList";
import ProjectList from "./ProjectList";
import EditOrganizationDetailsAPI from "../../redux/actions/api/Organization/EditOrganizationDetails";
import APITransport from "../../redux/actions/apitransport/apitransport";
import MembersListAPI from "../../redux/actions/api/Organization/MembersList";

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

  const organizationDetails = useSelector(
    (state) => state.getOrganizationDetails.data
  );

  const projectList = useSelector((state) => state.getProjectList.data);

  const userList = useSelector((state) => state.getUserList.data);

  const MembersList = useSelector((state) => state.getMembersList.data)
 

  const getOrganizationDetails = () => {
    const userObj = new FetchOrganizationDetailsAPI(id);
    dispatch(APITransport(userObj));
  };

  const getProjectList = () => {
    const userObj = new ProjectListAPI();
    dispatch(APITransport(userObj));
  };

  const getUserList = () => {
    const userObj = new FetchUserListAPI();
    dispatch(APITransport(userObj));
  };
  const getMembersList = () => {
    const userObj = new MembersListAPI(id);
    dispatch(APITransport(userObj));
  };


  useEffect(() => {
    getOrganizationDetails();
    getProjectList();
    getUserList();
    getMembersList();
  }, []);

  useEffect(() => {
    setOrganizationName(organizationDetails?.title);
  }, [organizationDetails]);

  const handleOrganizationUpdate = () => {
    const userObj = new EditOrganizationDetailsAPI(
      id,
      organizationName,
      organizationDetails?.email_domain_name
    );
    dispatch(APITransport(userObj));
  };

  const addNewMemberHandler = () => {
    const apiObj = new AddOrganizationMemberAPI(
      id,
      newMemberRole,
      newMemberName
    );
    dispatch(APITransport(apiObj));
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
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
            <Tab label={"Settings"} sx={{ fontSize: 16, fontWeight: "700" }} />
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
            <Button
              className={classes.projectButton}
              label={"Add New Project"}
              onClick={() => navigate(`/my-organization/${id}/create-new-project`)}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <ProjectList data={projectList} />
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
              label={"Add New Member"}
              onClick={() => setAddUserDialog(true)}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList data={MembersList} />
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

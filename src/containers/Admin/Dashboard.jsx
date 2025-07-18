import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { DatasetStyle } from "styles";

import { Box, Card, Grid, Tab, Tabs, Button, Typography, Paper } from "@mui/material";
import OrganizationList from "./OrganizationList";
import MemberList from "./MemberList";
import { AddNewMember, AddOrganizationMember } from "common";
import AdminLevelReport from "./AdminLevelReport";
import NewsLetter from "./NewsLetterTemplate";
import OnboardingRequests from "./OnboardingRequests";
import VideoTaskDetails from "./VideoTaskDetails";
import VideoDetails from "./VideoDetails"; 
import TaskDetails from "./TaskDetails";

// APIs
import { APITransport, AddOrganizationMemberAPI, FetchLoggedInUserDetailsAPI } from "redux/actions";

// Tab Panel Component
function TabPanel(props) {
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
}

const DashBoard = () => {
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch userData from Redux
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

  const [value, setValue] = useState(0); 
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = () => {
      const loggedInUserObj = new FetchLoggedInUserDetailsAPI();
      dispatch(APITransport(loggedInUserObj));
    };
    fetchUserData();
  }, [dispatch]);

  const addNewMemberHandler = async () => {
    const data = {
      role: "ORG_OWNER",
      emails: newMemberEmail,
    };

    const apiObj = new AddOrganizationMemberAPI(data);
    dispatch(APITransport(apiObj));

    setNewMemberEmail("");
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const adminTabs = [
    { label: "Organizations", component: <OrganizationList /> },
    { label: "Members", component: <MemberList /> },
    { label: "Reports", component: <AdminLevelReport /> },
    { label: "Newsletter", component: <NewsLetter /> },
    { label: "Onboarding Requests", component: <OnboardingRequests /> },
  ];

  const orgOwnerTabs = [
    { label: "Video Details", component: <VideoDetails /> },
    { label: "Video Task Details", component: <VideoTaskDetails /> },
    { label: "Task Details", component: <TaskDetails /> },
  ];

  const isAdmin = userData?.role === "ADMIN";
  const isOrgOwner = userData?.role === "ORG_OWNER";

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Box>
          <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" variant="scrollable">
            {isAdmin &&
              adminTabs.map((tab, index) => (
                <Tab key={index} label={tab.label} sx={{ fontSize: 16, fontWeight: "700" }} />
              ))}

            {isOrgOwner &&
              orgOwnerTabs.map((tab, index) => (
                <Tab key={index} label={tab.label} sx={{ fontSize: 17, fontWeight: "700", marginRight: "28px" }} />
              ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 1 }}>
          {isAdmin && (
            <>
              <TabPanel value={value} index={0}>
                <Grid container direction="row" sx={{ my: 4 }}>
                  <Grid item md={6} xs={12}>
                    <Button
                      style={{ marginRight: "10px", width: "100%" }}
                      variant="contained"
                      onClick={() => navigate(`/admin/create-new-org`)}
                    >
                      Add New Organization
                    </Button>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Button
                      style={{ marginLeft: "10px", width: "100%" }}
                      variant="contained"
                      onClick={() => setOpenMemberDialog(true)}
                    >
                      Create New Members
                    </Button>
                  </Grid>

                  <Grid item md={12} xs={12} style={{ width: "100%" }}>
                    <div className={classes.workspaceTables} style={{ width: "100%" }}>
                      <OrganizationList />
                    </div>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Box display={"flex"} flexDirection="column" justifyContent="center" alignItems="center">
                  <Button className={classes.projectButton} onClick={() => setAddUserDialog(true)} variant="contained">
                    Add New Member
                  </Button>

                  <div className={classes.workspaceTables} style={{ width: "100%" }}>
                    <MemberList />
                  </div>
                </Box>
              </TabPanel>

              <TabPanel value={value} index={2}>
                <Box display={"flex"} flexDirection="column" justifyContent="center" alignItems="center">
                  <div className={classes.workspaceTables} style={{ width: "100%" }}>
                    <AdminLevelReport />
                  </div>
                </Box>
              </TabPanel>

              <TabPanel value={value} index={3}>
                <Box display={"flex"} flexDirection="column" justifyContent="center" alignItems="center">
                  <div className={classes.workspaceTables} style={{ width: "100%" }}>
                    <NewsLetter />
                  </div>
                </Box>
              </TabPanel>

              <TabPanel value={value} index={4}>
                <Grid container direction="row" sx={{ my: 4 }}>
                  <Grid item md={12} xs={12} style={{ width: "100%" }}>
                    <div className={classes.workspaceTables} style={{ width: "100%" }}>
                      <OnboardingRequests />
                    </div>
                  </Grid>
                </Grid>
              </TabPanel>
            </>
          )}

          {isOrgOwner && (
            <>
              <TabPanel value={value} index={0}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: "ButtonHighlight", padding: "32px" }}>
                  <VideoDetails />
                </Paper>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: "ButtonHighlight", padding: "32px" }}>
                  <VideoTaskDetails />
                </Paper>
              </TabPanel>

              <TabPanel value={value} index={2}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: "ButtonHighlight", padding: "32px" }}>
                  <TaskDetails />
                </Paper>
              </TabPanel>
            </>
          )}
        </Box>
      </Card>

      {/* Dialogs */}
      {addUserDialog && (
        <AddOrganizationMember
          open={addUserDialog}
          handleUserDialogClose={() => {
            setAddUserDialog(false);
            setNewMemberEmail("");
          }}
          title={"Add New Members"}
          textFieldLabel={"Enter Email Id of Member"}
          textFieldValue={newMemberEmail}
          handleTextField={setNewMemberEmail}
          addBtnClickHandler={addNewMemberHandler}
          isAdmin={true}
        />
      )}

      {openMemberDialog && <AddNewMember open={openMemberDialog} handleClose={() => setOpenMemberDialog(false)} />}
    </Grid>
  );
};

export default DashBoard;
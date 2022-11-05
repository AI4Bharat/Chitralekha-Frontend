//My Organization
import { useEffect, useState } from "react";

//APIs
import FetchOrganizationDetailsAPI from "../../../redux/actions/api/Organization/FetchOrganizationDetails";
import ProjectListAPI from "../../../redux/actions/api/Organization/ProjectList";
import FetchUserListAPI from "../../../redux/actions/api/User/FetchUserList";
import ProjectList from "../ProjectList";
import EditOrganizationDetailsAPI from "../../../redux/actions/api/Organization/EditOrganizationDetails";
import APITransport from "../../../redux/actions/apitransport/apitransport";

import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

//Styles
import DatasetStyle from "../../../styles/Dataset";

//Components
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import Button from "../../../common/Button";
import UserList from "../UserList";
import OutlinedTextField from "../../../common/OutlinedTextField";
import AddDialog from "../../../common/AddDialog";

const data = [
  {
    id: "1",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "2",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "3",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "4",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "5",
    title: "test1",
    type: "video",
    mode: "test1",
  },
];

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

const Project = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();

  const [value, setValue] = useState(0);
  const [organizationName, setOrganizationName] = useState("");
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [addProjectDialog, setAddProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const addNewProjectHandler = () => {};
  const addNewMemberHandler = () => {};

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Title
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
          Created by :
        </Typography>

        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label={"Videos"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Managers"} sx={{ fontSize: 16, fontWeight: "700" }} />
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
              label={"Create a New Video"}
              onClick={() => {}}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <ProjectList data={data}/>
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
                label={"Add project members"}
                onClick={() => {}}
              />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList />
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
              <Button
                className={classes.projectButton}
                label={"Add project managers"}
                onClick={() => {}}
              />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={3}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Typography variant="h4">Edit Project</Typography>
          <OutlinedTextField
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            sx={{ width: "100%", mt: 5 }}
            placeholder="Organization Name..."
          />
          <Button
            label={"Change"}
            onClick={() => {}}
            sx={{ mt: 5, width: "100%" }}
          />
          <Button
            label={"Archive Project"}
            onClick={() => {}}
            sx={{ mt: 5, width: "100%", background: "rgb(207, 89, 89)" }}
          />
        </TabPanel>
      </Card>

      {addProjectDialog && (
        <AddDialog
          open={addProjectDialog}
          handleUserDialogClose={() => setAddProjectDialog(false)}
          title={"Add New Projects"}
          textFieldLabel={"Project Name"}
          textFieldValue={newProjectName}
          handleTextField={setNewProjectName}
          addBtnClickHandler={addNewProjectHandler}
        />
      )}

      {addUserDialog && (
        <AddDialog
          open={addUserDialog}
          handleUserDialogClose={() => setAddUserDialog(false)}
          title={"Add New Members"}
          textFieldLabel={"Enter Email Id of Member"}
          textFieldValue={newMemberName}
          handleTextField={setNewMemberName}
          addBtnClickHandler={addNewMemberHandler}
          isAddMember={true}
          selectFieldValue={newMemberRole}
          handleSelectField={setNewMemberRole}
        />
      )}
    </Grid>
  );
};

export default Project;

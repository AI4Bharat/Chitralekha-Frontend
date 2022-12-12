//My Organization
import { useEffect, useState } from "react";

//APIs
import FetchProjectDetailsAPI from "../../../redux/actions/api/Project/FetchProjectDetails";
import FetchVideoListAPI from "../../../redux/actions/api/Project/FetchVideoList";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import CreateNewVideoAPI from "../../../redux/actions/api/Project/CreateNewVideo";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Styles
import DatasetStyle from "../../../styles/Dataset";

//Components
import { Box, Card, Grid, Tab, Tabs, Typography,FormControl,Checkbox,ListItemText,ListItemIcon } from "@mui/material";
import Button from "../../../common/Button";
import UserList from "../UserList";
import CreateVideoDialog from "../../../common/CreateVideoDialog";
import ProjectSettings from "./ProjectSettings";
import VideoList from "./VideoList";
import ProjectMemberDetails from "./ProjectMemberDetails";
import TaskList from "./TaskList";
import CustomizedSnackbars from "../../../common/Snackbar";
import AddProjectMembers from "../../../common/AddProjectMembers";
import FetchManagerNameAPI from "../../../redux/actions/api/User/FetchUserList";
import AddProjectMembersAPI from "../../../redux/actions/api/Project/AddProjectMembers";
import FetchProjectMembersAPI from "../../../redux/actions/api/Project/FetchProjectMembers";
import FetchOrganizatioUsersAPI from "../../../redux/actions/api/Organization/FetchOrganizatioUsers";

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
  const { projectId,orgId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();

  const [addmembers, setAddmembers] = useState([]);
  const [addUserDialog, setAddUserDialog] = useState(false);

  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const projectvideoList = useSelector(
    (state) => state.getProjectVideoList.data
  );

  // const managerNames = useSelector((state) => state.getUserList.data
  // );

 const userList = useSelector((state) => state.getOrganizatioUsers.data);
console.log(userList,"userList")
  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectMembers();
  }, []);
  const GetManagerName =()=>{
    const apiObj = new FetchManagerNameAPI();
     dispatch(APITransport(apiObj));
  }

  useEffect(() => {
    GetManagerName()
  }, [])


  const [value, setValue] = useState(0);
  const [projectDetails, SetProjectDetails] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [createVideoDialog, setCreateVideoDialog] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [isAudio, setIsAudio] = useState(false);
  const [lang, setLang] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    SetProjectDetails(projectInfo);
  }, [projectInfo]);

  useEffect(() => {
    setVideoList(projectvideoList);
  }, [projectvideoList]);

  const getProjectnDetails = () => {
    const apiObj = new FetchProjectDetailsAPI(projectId);
    dispatch(APITransport(apiObj));
  };

  const getProjectVideoList = () => {
    const apiObj = new FetchVideoListAPI(projectId);
    dispatch(APITransport(apiObj));
  };
  const getOrganizatioUsersList = () => {
    const userObj = new FetchOrganizatioUsersAPI(orgId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectnDetails();
    getProjectVideoList(); 
    getOrganizatioUsersList();
  }, []);

  const addNewMemberHandler = async() => {

    const selectedMemberIdArr = addmembers.map((el,i)=>{
      return el.id;
    })
  
    const apiObj = new AddProjectMembersAPI(projectId, {user_id:selectedMemberIdArr});
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
        message:  resp?.message,
        variant: "success",
      })
      getProjectMembers();

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.error,
        variant: "error",
      })
    }
  }

  const addNewVideoHandler = async() => {
    const apiObj = new CreateNewVideoAPI(videoLink, isAudio, projectId, lang);
    dispatch(APITransport(apiObj));
    setCreateVideoDialog(false);
    setVideoLink("");
    setIsAudio(false);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
  
    if (res.ok) {
      // setSnackbarInfo({
      //   open: true,
      //   message: resp?.message,
      //   variant: "success",
      // })
      getProjectVideoList();

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
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
          {/* Title:  */}
          {projectDetails.title}
        </Typography>
{/* 
        <Typography variant="body1" gutterBottom component="div">
          Created by:{" "}
          {`${projectDetails.created_by?.first_name} ${projectDetails.created_by?.last_name}`}
        </Typography> */}

        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label={"Videos"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Tasks"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            {/* <Tab label={"Managers"} sx={{ fontSize: 16, fontWeight: "700" }} /> */}
            {/* <Tab label={"Settings"} sx={{ fontSize: 16, fontWeight: "700" }} /> */}
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
              label={"Create a New Video/Audio"}
              onClick={() => setCreateVideoDialog(true)}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <VideoList data={videoList} 
              removeVideo={() => getProjectVideoList()}
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
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <TaskList />
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
              label={"Add project members"}
              onClick={() => setAddUserDialog(true)}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <ProjectMemberDetails />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={3}
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
              onClick={() => { }}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList data={data} />
            </div>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={4} style={{ maxWidth: "100%" }}>
          <ProjectSettings projectInfo={projectInfo} />
        </TabPanel>
      </Card>

      {createVideoDialog && (
        <CreateVideoDialog
          open={createVideoDialog}
          handleUserDialogClose={() => setCreateVideoDialog(false)}
          videoLink={videoLink}
          setVideoLink={setVideoLink}
          isAudio={isAudio}
          setIsAudio={setIsAudio}
          addBtnClickHandler={addNewVideoHandler}
          lang={lang}
          setLang={setLang}
        />
      )}
      <AddProjectMembers 
       managerNames={userList}
       open={addUserDialog}
       handleUserDialogClose={() => setAddUserDialog(false)}
       addBtnClickHandler={addNewMemberHandler}
       selectFieldValue={addmembers}
       handleSelectField={(item)=>setAddmembers(item)}
      // handleSelectField={(items)=>console.log(items)}
      />
    </Grid>
  );
};

export default Project;

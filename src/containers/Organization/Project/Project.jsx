//My Organization
import { useEffect, useState } from "react";

//APIs
import FetchProjectDetailsAPI from "../../../redux/actions/api/Project/FetchProjectDetails";
import FetchVideoListAPI from "../../../redux/actions/api/Project/FetchVideoList";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import CreateNewVideoAPI from "../../../redux/actions/api/Project/CreateNewVideo";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";

//Styles
import DatasetStyle from "../../../styles/datasetStyle";

//Components
import {
  Box,
  Card,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import CreateVideoDialog from "../../../common/CreateVideoDialog";
import VideoList from "./VideoList";
import ProjectMemberDetails from "./ProjectMemberDetails";
import TaskList from "./TaskList";
import CustomizedSnackbars from "../../../common/Snackbar";
import AddProjectMembers from "../../../common/AddProjectMembers";
import FetchManagerNameAPI from "../../../redux/actions/api/User/FetchUserList";
import AddProjectMembersAPI from "../../../redux/actions/api/Project/AddProjectMembers";
import FetchProjectMembersAPI from "../../../redux/actions/api/Project/FetchProjectMembers";
import FetchOrganizatioUsersAPI from "../../../redux/actions/api/Organization/FetchOrganizatioUsers";
import { roles } from "../../../utils/utils";
import ProjectDescription from "./ProjectDescription";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Loader from "../../../common/Spinner";
import ProjectReport from "./ProjectReport";
import C from "../../../redux/constants";
import AlertComponent from "../../../common/Alert";
import { useRef } from "react";
import UploadCSVAPI from "../../../redux/actions/api/Project/UploadCSV";
import CSVAlertComponent from "../../../common/csvUploadFailAlert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  const { projectId, orgId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const csvUpload = useRef();

  const [addmembers, setAddmembers] = useState([]);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showCSVAlert, setShowCSVAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [voice, setVoice] = useState("");
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
  const [projectData, setProjectData] = useState([
    { name: "Project ID", value: null },
    { name: "CreatedAt", value: null },
    { name: "UserName", value: null },
  ]);
  const [videoDescription, setVideoDescription] = useState("");
  const [speakerInfo, setSpeakerInfo] = useState([
    {
      name: "",
      gender: "",
      age: "",
      id: "",
    },
  ]);

  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const projectvideoList = useSelector(
    (state) => state.getProjectVideoList.data
  );
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const userList = useSelector((state) => state.getOrganizatioUsers.data);

  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  const GetManagerName = () => {
    const apiObj = new FetchManagerNameAPI();
    dispatch(APITransport(apiObj));
  };

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
    getProjectMembers();
    GetManagerName();
    getProjectnDetails();
    getProjectVideoList();
    getOrganizatioUsersList();

    return () => {
      dispatch({ type: C.CLEAR_PROJECT_VIDEOS, payload: [] });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setProjectData([
      {
        name: "Project ID",
        value: projectInfo.id,
      },
      {
        name: "Created At",
        value: moment(projectInfo.created_at).format("DD/MM/YYYY HH:MM:SS"),
      },
      {
        name: "Created By",
        value: projectInfo?.created_by?.username,
      },
    ]);
    // eslint-disable-next-line
  }, [projectInfo.id]);

  useEffect(() => {
    SetProjectDetails(projectInfo);
    setVideoList(projectvideoList);
  }, [projectInfo, projectvideoList]);

  const addNewMemberHandler = async () => {
    const selectedMemberIdArr = addmembers.map((el, i) => {
      return el.id;
    });

    const apiObj = new AddProjectMembersAPI(projectId, {
      user_id: selectedMemberIdArr,
    });
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
      getProjectMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const addNewVideoHandler = async () => {
    const link = encodeURIComponent(videoLink.replace(/&amp;/g, "&"));
    const desc = encodeURIComponent(videoDescription.replace(/&amp;/g, "&"));
    const create = true;
    setSnackbarInfo({
      open: true,
      message: "Your request is being processed.",
      variant: "info",
    });

    const apiObj = new CreateNewVideoAPI(
      link,
      isAudio,
      projectId,
      lang,
      desc,
      create,
      voice,
      speakerInfo
    );

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setShowAlert(true);
      setAlertData(resp);
      setSnackbarInfo({
        open: false,
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }

    setCreateVideoDialog(false);
    getProjectVideoList();
    setIsAudio(false);
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

  const handeFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result;
      const csv = btoa(csvData);

      const uploadCSVObj = new UploadCSVAPI("project");
      const res = await fetch(uploadCSVObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify({ project_id: +projectId, csv }),
        headers: uploadCSVObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setShowCSVAlert(true);
        setAlertData(resp);
      }
    };
    reader.readAsBinaryString(file[0]);
  };

  const renderProjectDetails = () => {
    if (!projectInfo || projectInfo.length <= 0) {
      return <Loader />;
    }

    return (
      <>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#0F2749",
              borderRadius: "8px",
              marginBottom: "15px",
              padding: "35px",
            }}
          >
            <Typography variant="h4" className={classes.mainTitle}>
              {projectDetails.title}
            </Typography>
            <IconButton
              onClick={() =>
                navigate(
                  `/my-organization/${orgId}/project/${projectId}/edit-project`
                )
              }
              style={{
                padding: "0",
              }}
            >
              <Tooltip title="Settings">
                <SettingsOutlinedIcon
                  color="primary"
                  style={{
                    color: "#f1f1f1",
                    fontSize: "2.25rem",
                  }}
                />
              </Tooltip>
            </IconButton>
          </Card>
        </Grid>

        {projectDetails.description && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h6" className={classes.modelTitle}>
              Description
            </Typography>
            <Typography
              variant="body1"
              style={{
                textAlign: "justify",
                margin: "5px 0 20px 0",
                lineHeight: "1.2",
              }}
            >
              {projectDetails.description}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {projectData?.map((des, i) => (
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4} key={i}>
                <ProjectDescription
                  name={des.name}
                  value={des.value}
                  index={i}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
      {renderProjectDetails()}

      <Card className={classes.workspaceCard}>
        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label={"Videos"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Tasks"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            {roles.filter((role) => role.value === userData?.role)[0]
              ?.ProjectReport && (
              <Tab label={"Reports"} sx={{ fontSize: 16, fontWeight: "700" }} />
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
            {roles.filter((role) => role.value === userData?.role)[0]
              ?.permittedToCreateVideoAudio && (
              <Box display={"flex"} width={"100%"}>
                <Button
                  style={{ marginRight: "10px" }}
                  className={classes.projectButton}
                  onClick={() => setCreateVideoDialog(true)}
                  variant="contained"
                >
                  Create a New Video/Audio
                </Button>

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
                          `https://chitralekhadev.blob.core.windows.net/multimedia/SampleInputProjectUpload.csv`
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
              </Box>
            )}

            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <VideoList
                data={videoList}
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
            {(projectInfo?.managers?.some((item) => item.id === userData.id) ||
              userData.role === "ORG_OWNER") && (
              <Button
                className={classes.projectButton}
                onClick={() => setAddUserDialog(true)}
                variant="contained"
              >
                Add Project Members
              </Button>
            )}
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
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <ProjectReport />
            </div>
          </Box>
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
          videoDescription={videoDescription}
          setVideoDescription={setVideoDescription}
          voice={voice}
          setVoice={setVoice}
          setSpeakerInfo={setSpeakerInfo}
          speakerInfo={speakerInfo}
        />
      )}

      {addUserDialog && (
        <AddProjectMembers
          managerNames={userList}
          open={addUserDialog}
          handleUserDialogClose={() => setAddUserDialog(false)}
          addBtnClickHandler={addNewMemberHandler}
          selectFieldValue={addmembers}
          handleSelectField={(item) => setAddmembers(item)}
          title="Add Project Members"
        />
      )}

      {showAlert && (
        <AlertComponent
          open={showAlert}
          onClose={() => setShowAlert(false)}
          message={alertData.message}
          report={alertData.detailed_report}
        />
      )}

      {showCSVAlert && (
        <CSVAlertComponent
          open={showCSVAlert}
          onClose={() => setShowCSVAlert(false)}
          message={alertData.message}
          report={alertData.response}
        />
      )}
    </Grid>
  );
};

export default Project;

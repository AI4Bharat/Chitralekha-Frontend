//My Organization
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import { roles } from "utils";

//APIs
import {
  APITransport,
  AddProjectMembersAPI,
  CreateNewVideoAPI,
  FetchManagerNameAPI,
  FetchOrganizatioUsersAPI,
  FetchProjectDetailsAPI,
  FetchProjectMembersAPI,
  FetchVideoListAPI,
  UploadCSVAPI,
  setSnackBar,
  updateProjectTabIndex,
} from "redux/actions";
import C from "redux/constants";

//Styles
import { DatasetStyle } from "styles";

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
import VideoList from "./VideoList";
import ProjectMemberDetails from "./ProjectMemberDetails";
import TaskList from "./TaskList";
import ProjectDescription from "./ProjectDescription";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ProjectReport from "./ProjectReport";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  AddProjectMembers,
  AlertComponent,
  CreateVideoDialog,
  Loader,
} from "common";

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
  const [alertData, setAlertData] = useState({});
  const [voice, setVoice] = useState("");
  const [projectDetails, SetProjectDetails] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [createVideoDialog, setCreateVideoDialog] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [isAudio, setIsAudio] = useState(false);
  const [lang, setLang] = useState("");
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
  const [speakerType, setSpeakerType] = useState("individual");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColumn, setAlertColumn] = useState("");

  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const projectvideoList = useSelector(
    (state) => state.getProjectVideoList.data
  );
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const userList = useSelector((state) => state.getOrganizatioUsers.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const tabIndex = useSelector((state) => state.taskFilters.tabIndex);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "ADD_PROJECT_MEMBERS") {
          getProjectMembers();
        }

        if (apiType === "CREATE_NEW_VIDEO") {
          dispatch(setSnackBar({ open: false }));
          setShowAlert(true);
          setAlertData(data.detailed_report);
          setAlertMessage(data.message);
          setAlertColumn("createVideoAlertColumns");
          getProjectVideoList();
        }
      } else {
        if (apiType === "UPLOAD_CSV") {
          dispatch(setSnackBar({ open: false }));
          setShowAlert(true);
          setAlertMessage(data.message);
          setAlertData(data.response);
          setAlertColumn("csvAlertColumns");
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

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
    const body = {
      user_id: addmembers.map((el, i) => el.id),
    };

    const apiObj = new AddProjectMembersAPI(projectId, body);
    dispatch(APITransport(apiObj));
  };

  const addNewVideoHandler = async () => {
    const link = encodeURIComponent(videoLink.replace(/&amp;/g, "&"));
    const desc = encodeURIComponent(videoDescription.replace(/&amp;/g, "&"));
    const create = true;

    dispatch(
      setSnackBar({
        open: true,
        message: "Your request is being processed.",
        variant: "info",
      })
    );

    const apiObj = new CreateNewVideoAPI(
      link,
      isAudio,
      projectId,
      lang,
      desc,
      create,
      voice,
      speakerInfo,
      speakerType
    );
    dispatch(APITransport(apiObj));

    setCreateVideoDialog(false);
    setIsAudio(false);
  };

  const handeFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result;
      const csv = btoa(csvData);

      const uploadCSVObj = new UploadCSVAPI("project", projectId, csv);
      dispatch(APITransport(uploadCSVObj));
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
      {renderProjectDetails()}

      <Card className={classes.workspaceCard}>
        <Box>
          <Tabs
            value={tabIndex}
            onChange={(_event, newValue) =>
              dispatch(updateProjectTabIndex(newValue))
            }
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
          value={tabIndex}
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
          value={tabIndex}
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
          value={tabIndex}
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
          value={tabIndex}
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
          speakerType={speakerType}
          setSpeakerType={setSpeakerType}
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
          onClose={() => {
            setAlertData([]);
            setShowAlert(false);
          }}
          message={alertMessage}
          report={alertData}
          columns={alertColumn}
        />
      )}
    </Grid>
  );
};

export default Project;

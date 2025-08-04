//My Organization
import { useEffect, useState } from "react";
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
} from "redux/actions";
import C from "redux/constants";
import InviteManagerSuggestions from "redux/actions/api/Organization/InviteManagerSuggestions";
import GetManagerSuggestionsAPI from "redux/actions/api/Organization/GetManagerSuggestions";
import ApproveManagerSuggestionsAPI from "redux/actions/api/Organization/ApproveManagerSuggestions";
import RejectManagerSuggestionsAPI from "redux/actions/api/Organization/RejectManagerSuggestions";

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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
import UploadFileDialog from "common/UploadFileDialog";
import apistatus from "redux/reducers/apistatus/apistatus";
import ProjectManagerSuggestions from "common/ManagerSuggestions";

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

  const [addmembers, setAddmembers] = useState([]);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [voice, setVoice] = useState("");
  const [loading, setloading] = useState(false);
  const [projectDetails, SetProjectDetails] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [createVideoDialog, setCreateVideoDialog] = useState(false);
  const [duration, setDuration] = useState("00:00:00");
  const [videoLink, setVideoLink] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
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
  const [orgOwnerId, setOrgOwnerId] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [openUploadBulkVideoDialog, setOpenUploadBulkVideoDialog] =
    useState(false);
  const [openProjectManagerSuggestionsDialog, setOpenProjectManagerSuggestionsDialog] = useState(false);
  const [managerSuggestions, setManagerSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");

  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const projectvideoList = useSelector(
    (state) => state.getProjectVideoList.data
  );
    const [isProjectDetailsLoading, setIsProjectDetailsLoading] = useState(true);
  const [isVideoListLoading, setIsVideoListLoading] = useState(true);
  const [isMembersLoading, setIsMembersLoading] = useState(true);

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const userList = useSelector((state) => state.getOrganizatioUsers.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      const {
        organization: { organization_owners },
      } = userData;
  
      if (organization_owners && organization_owners.length > 0) {
        const ownerIds = organization_owners.map(owner => owner.id);
        setOrgOwnerId(ownerIds);

        if (ownerIds.includes(userData.id)) {
          setIsUserOrgOwner(true);
        } else {
          setIsUserOrgOwner(false);
        }
      }
    }
  }, [userData]);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    

    if (!progress) {
      if (success) {
        if (apiType === "ADD_PROJECT_MEMBERS") {
          getProjectMembers();
        }

        if (apiType === "UPLOAD_CSV") {
          setOpenUploadBulkVideoDialog(false);
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
          setOpenUploadBulkVideoDialog(false);
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);
  
  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (progress) {
      console.log(apiType,apiStatus.progress);

      switch (apiType) {
        case "GET_PROJECT_DETAILS":
          setIsProjectDetailsLoading(true);
          break;
        case "GET_PROJECT_VIDEOS":
          setIsVideoListLoading(true);
          break;
        case "GET_PROJECT_MEMBERS":
          setIsMembersLoading(true);
          break;
        default:
          break;
      }
    } else {
      if (success) {
        switch (apiType) {
          case "GET_PROJECT_DETAILS":
            setIsProjectDetailsLoading(false);
            break;
          case "GET_PROJECT_VIDEOS":
            setIsVideoListLoading(false);
            break;
          case "GET_PROJECT_MEMBERS":
            setIsMembersLoading(false);
            break;
          default:
            break;
        }
      }
    }
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

  const fetchManagerSuggestions = async () => {
    console.log("Debug - fetchManagerSuggestions called with orgId:", orgId);
    setSuggestionsLoading(true);
    setSuggestionsError("");
    try {
      const apiObj = new GetManagerSuggestionsAPI(orgId);
      console.log("Debug - API endpoint:", apiObj.apiEndPoint());
      console.log("Debug - API headers:", apiObj.getHeaders());
      const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
      console.log("Debug - API response status:", res.status);
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      // Shoonya-style: use data.data as user list, filter for has_accepted_invite === false
      const userArr = Array.isArray(data) ? data : data.data || [];
      const pendingInvites = userArr.filter((user) => user.has_accepted_invite === false);
      console.log('Debug - userArr:', userArr);
      console.log('Debug - pendingInvites:', pendingInvites);
      setManagerSuggestions(pendingInvites);
    } catch (err) {
      console.log("Debug - Error fetching suggestions:", err);
      setSuggestionsError("Failed to fetch suggestions");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleApproveSuggestion = async (suggestionId) => {
    setSuggestionsLoading(true);
    setSuggestionsError("");
    try {
      const apiObj = new ApproveManagerSuggestionsAPI(suggestionId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "POST", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to approve");
      dispatch(setSnackBar({
        open: true,
        message: "Suggestion approved successfully",
        variant: "success",
      }));
      await fetchManagerSuggestions();
    } catch (err) {
      setSuggestionsError("Failed to approve suggestion");
      dispatch(setSnackBar({
        open: true,
        message: "Failed to approve suggestion",
        variant: "error",
      }));
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleRejectSuggestion = async (suggestionId) => {
    setSuggestionsLoading(true);
    setSuggestionsError("");
    try {
      const apiObj = new RejectManagerSuggestionsAPI(suggestionId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "DELETE", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reject");
      dispatch(setSnackBar({
        open: true,
        message: "Suggestion rejected successfully",
        variant: "success",
      }));
      await fetchManagerSuggestions();
    } catch (err) {
      setSuggestionsError("Failed to reject suggestion");
      dispatch(setSnackBar({
        open: true,
        message: "Failed to reject suggestion",
        variant: "error",
      }));
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const temp = +localStorage.getItem("projectTabIndex");
    temp && setTabIndex(temp);

    getProjectMembers();
    GetManagerName();
    getProjectnDetails();
    getProjectVideoList();
    getOrganizatioUsersList();

    // Debug logging for tab visibility
    console.log("Debug - userData:", userData);
    console.log("Debug - isUserOrgOwner:", isUserOrgOwner);
    console.log("Debug - userData?.role:", userData?.role);
    console.log("Debug - Should show Manager Suggestions tab:", (isUserOrgOwner || userData?.role === "ADMIN"));

    // Fetch manager suggestions if user is admin/owner
    if (isUserOrgOwner || userData?.role === "ADMIN") {
      console.log("Debug - Fetching manager suggestions...");
      fetchManagerSuggestions();
    }

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
    console.log("addmembers before API call:", addmembers);
    if (userData?.role === "PROJECT_MANAGER") {
      // Use selected emails from the dialog
      const emails = addmembers;
      console.log("emails to send (selected):", emails);
      const role = "PROJECT_MEMBER"; // Adjust as needed
      const apiObj = new InviteManagerSuggestions(orgId, emails, role);
      dispatch(APITransport(apiObj));
      dispatch(setSnackBar({
        open: true,
        message: "Your suggestion has been sent for approval.",
        variant: "info",
      }));
    } else {
      // Map selected emails back to user IDs
      const selectedUsers = userList.filter(user => addmembers.includes(user.email));
      const body = {
        user_id: selectedUsers.map(user => user.id),
      };
      console.log("user_id to send:", body.user_id);
      const apiObj = new AddProjectMembersAPI(projectId, body);
      dispatch(APITransport(apiObj));
    }
  };

  const addNewVideoHandler = async () => {
    const link = encodeURIComponent(videoLink.replace(/&amp;/g, "&"));
    const desc = encodeURIComponent(videoDescription.replace(/&amp;/g, "&"));
    const dur = encodeURIComponent(duration);
    const ytLink = encodeURIComponent(youtubeUrl.replace(/&amp;/g, "&"));
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
      speakerType,
      dur,
      ytLink
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

    return (
      <>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
          <Card
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#0F2749",
              borderRadius: "8px",
              margin: "0  10px 0  10px",
              padding: "1.3rem",
              alignItems:"center"
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
          <Grid item xs={6} sm={12} md={12} lg={12} xl={12}>
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

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ m: 1.5 }}>
          <Grid container spacing={1}>
            {projectData?.map((des, i) => (
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} key={i}
              >
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
            onChange={(_event, newValue) => {
              setTabIndex(newValue);
              localStorage.setItem("projectTabIndex", newValue);
            }}
            aria-label="basic tabs example"
            variant="scrollable"
          >
            <Tab label={"Videos"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Tasks"} sx={{ fontSize: 16, fontWeight: "700" }} />
            {/* <Tab label={"Members1"} sx={{ fontSize: 16, fontWeight: "700" }} /> */}
            {roles.filter((role) => role.value === userData?.role)[0]
              ?.canAddMembers && (
              <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            )}
            {(() => {
              console.log("Debug - Rendering Manager Suggestions tab condition:", (isUserOrgOwner || userData?.role === "ADMIN"));
              return (isUserOrgOwner || userData?.role === "ADMIN") && (
                <Tab label={"Manager Suggestions"} sx={{ fontSize: 16, fontWeight: "700" }} />
              );
            })()}
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
            gap={2}
          >
            {roles.filter((role) => role.value === userData?.role)[0]
              ?.permittedToCreateVideoAudio && (
              <Box display={"flex"} width={"100%"} gap={1} flexDirection={{xs:'column',md:'row'}}>
                <Button
                  className={classes.projectButton}
                  onClick={() => setCreateVideoDialog(true)}
                  variant="contained"
                >
                  Create a New Video/Audio
                </Button>

                <Button
                  className={classes.projectButton}
                  variant="contained"
                  onClick={() => setOpenUploadBulkVideoDialog(true)}
                >
                  Bulk Video Upload
                  <Tooltip title="Download sample CSV">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.assign(
                          `https://chitralekhastoragedev.blob.core.windows.net/multimedia/SampleInputProjectUpload.csv`
                        );
                      }}
                      sx={{ color: "white" }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Button>
              </Box>
            )}

            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <VideoList
                data={videoList}
                removeVideo={() => getProjectVideoList()}
                loading={isVideoListLoading}
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
            <Box display="flex" gap={2} mb={2}>
              {(projectInfo?.managers?.some((item) => item.id === userData.id) ||
                isUserOrgOwner || userData?.role === "ADMIN") && (
                <Button
                  className={classes.projectButton}
                  onClick={() => setAddUserDialog(true)}
                  variant="contained"
                >
                  Add Project Members
                </Button>
              )}
            </Box>
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
            {suggestionsError && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {suggestionsError}
              </Alert>
            )}
            
            {suggestionsLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <Loader />
              </Box>
            ) : managerSuggestions.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                No manager suggestions found.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {managerSuggestions.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.has_accepted_invite ? "Accepted" : "Pending"}
                            color={user.has_accepted_invite ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>
        <TabPanel
          value={tabIndex}
          index={4}
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
          duration={duration}
          setDuration={setDuration}
          youtubeUrl={youtubeUrl}
          setYoutubeUrl={setYoutubeUrl}
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
          userRole={userData?.role}
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

      {openUploadBulkVideoDialog && (
        <UploadFileDialog
          openDialog={openUploadBulkVideoDialog}
          handleClose={() => setOpenUploadBulkVideoDialog(false)}
          title={"Upload Bulk Videos"}
          handleSubmit={handeFileUpload}
        />
      )}

      {openProjectManagerSuggestionsDialog && (
        <ProjectManagerSuggestions
          open={openProjectManagerSuggestionsDialog}
          onClose={() => setOpenProjectManagerSuggestionsDialog(false)}
          projectId={projectId}
        />
      )}
    </Grid>
  );
};

export default Project;

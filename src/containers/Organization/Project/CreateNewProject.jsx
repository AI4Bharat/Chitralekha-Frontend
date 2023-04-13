import {
  Card,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Chip,
  Checkbox,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OutlinedTextField from "../../../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import CustomButton from "../../../common/Button";
import CreateNewProjectAPI from "../../../redux/actions/api/Project/CreateNewProject";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import CustomizedSnackbars from "../../../common/Snackbar";
import FetchOrganizatioProjectManagersUserAPI from "../../../redux/actions/api/Organization/FetchOrganizatioProjectManagersUser";
import FetchTranscriptTypesAPI from "../../../redux/actions/api/Project/FetchTranscriptTypes";
import FetchTranslationTypesAPI from "../../../redux/actions/api/Project/FetchTranslationTypes";
import FetchBulkTaskTypeAPI from "../../../redux/actions/api/Project/FetchBulkTaskTypes";
import FetchSupportedLanguagesAPI from "../../../redux/actions/api/Project/FetchSupportedLanguages";
import FetchOrganizatioUsersAPI from "../../../redux/actions/api/Organization/FetchOrganizatioUsers";
import FetchOrganizationDetailsAPI from "../../../redux/actions/api/Organization/FetchOrganizationDetails";
import Loader from "../../../common/Spinner";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreatenewProject = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userList = useSelector(
    (state) => state.getOrganizatioProjectManagersUser.data
  );
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );
  const organizationDetails = useSelector(
    (state) => state.getOrganizationDetails.data
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerUsername, setManagerUsername] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [transcriptSourceType, setTranscriptSourceType] =
    useState("MACHINE_GENERATED");
  const [translationSourceType, setTranslationSourceType] =
    useState("MACHINE_GENERATED");
  const [defaultTask, setDefaultTask] = useState([]);
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceOverSourceType, setVoiceOverSourceType] =
    useState("MACHINE_GENERATED");

  const disableBtn = () => {
    if (!title || managerUsername.length <= 0) {
      return true;
    }

    if (
      defaultTask.some((item) => item.value.includes("TRANSLATION")) &&
      translationLanguage.length <= 0
    ) {
      return true;
    }

    return false;
  };

  const getOrganizatioUsersList = () => {
    const projectrole = "PROJECT_MANAGER";
    const userObj = new FetchOrganizatioProjectManagersUserAPI(
      orgId,
      projectrole
    );
    dispatch(APITransport(userObj));
  };

  const getSourceTypes = () => {
    const transcriptObj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationTypesAPI();
    dispatch(APITransport(translationObj));

    const bulkTaskObj = new FetchBulkTaskTypeAPI();
    dispatch(APITransport(bulkTaskObj));

    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));

    const orgObj = new FetchOrganizatioUsersAPI(orgId);
    dispatch(APITransport(orgObj));

    const apiObj = new FetchOrganizationDetailsAPI(orgId);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    getOrganizatioUsersList();
    getSourceTypes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (organizationDetails.default_task_types) {
      const items = bulkTaskTypes.filter((item) =>
        organizationDetails.default_task_types.includes(item.value)
      );
      setDefaultTask(items);
    }

    if (organizationDetails.default_target_languages) {
      const items = supportedLanguages.filter((item) =>
        organizationDetails.default_target_languages.includes(item.value)
      );
      setTranslationLanguage(items);
    }
    // eslint-disable-next-line
  }, [organizationDetails]);

  const handleCreateProject = async () => {
    setLoading(true);
    const newPrjectReqBody = {
      title: title,
      description: description,
      organization_id: orgId,
      managers_id: managerUsername.map((item) => item.id),
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_voiceover_type: voiceOverSourceType,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
    };

    const apiObj = new CreateNewProjectAPI(newPrjectReqBody);
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
      setLoading(false);
      navigate(`/my-organization/${orgId}/project/${resp.project_id}`, {
        replace: true,
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
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
          Create a Project
        </Typography>

        <Box>
          <Typography gutterBottom component="div" label="Required">
            Title*
          </Typography>
          <OutlinedTextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required" multiline>
            Description
          </Typography>
          <OutlinedTextField
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Managers*
          </Typography>
          <FormControl fullWidth>
            <Select
              id="demo-multiple-name"
              multiple
              value={managerUsername}
              onChange={(event) => setManagerUsername(event.target.value)}
              MenuProps={MenuProps}
              renderValue={(selected) => {
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value, index) => {
                      return <Chip key={index} label={value.email} />;
                    })}
                  </Box>
                );
              }}
            >
              {userList.map((name, index) => (
                <MenuItem key={index} value={name}>
                  <Checkbox checked={managerUsername.indexOf(name) > -1} />
                  {name.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Transcription Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="transcript-source-type"
              value={transcriptSourceType}
              onChange={(event) => setTranscriptSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {transcriptTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Translation Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="translation-source-type"
              value={translationSourceType}
              onChange={(event) => setTranslationSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {translationTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Voiceover Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="Voiceover-source-type"
              value={voiceOverSourceType}
              onChange={(event) => setVoiceOverSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {translationTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Default Workflow
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              id="translation-source-type"
              value={defaultTask}
              onChange={(event) => setDefaultTask(event.target.value)}
              MenuProps={MenuProps}
              renderValue={(selected) => {
                selected.sort((a, b) => a.id - b.id);
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      return <Chip key={value.value} label={value.label} />;
                    })}
                  </Box>
                );
              }}
            >
              {bulkTaskTypes.map((item, index) => (
                <MenuItem key={index} value={item}>
                  <Checkbox checked={defaultTask.indexOf(item) > -1} />
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {defaultTask.filter((item) => item.value.includes("TRANSLATION"))
          .length > 0 && (
          <Box width={"100%"} sx={{ mt: 3 }}>
            <Typography gutterBottom component="div" label="Required">
              Select Translation Language
            </Typography>
            <FormControl fullWidth>
              <Select
                multiple
                fullWidth
                value={translationLanguage}
                onChange={(event) => setTranslationLanguage(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                renderValue={(selected) => {
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        return <Chip key={value.value} label={value.label} />;
                      })}
                    </Box>
                  );
                }}
              >
                {supportedLanguages?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    <Checkbox
                      checked={translationLanguage.indexOf(item) > -1}
                    />
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            style={{ borderRadius: 6, margin: "0px 20px 0px 0px" }}
            onClick={() => handleCreateProject()}
            disabled={disableBtn()}
          >
            Create Project{" "}
            {loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>

          <CustomButton
            label={"Cancel"}
            onClick={() => navigate(`/my-organization/${orgId}`)}
            buttonVariant="text"
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default CreatenewProject;

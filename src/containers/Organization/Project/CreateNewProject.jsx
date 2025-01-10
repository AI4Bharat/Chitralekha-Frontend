import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Styles
import { DatasetStyle } from "styles";

//Components
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
import { Loader, OutlinedTextField } from "common";

//APIs
import {
  APITransport,
  CreateNewProjectAPI,
  FetchOrganizatioProjectManagersUserAPI,
  FetchTranscriptTypesAPI,
  FetchTranslationTypesAPI,
  FetchBulkTaskTypeAPI,
  FetchSupportedLanguagesAPI,
  FetchOrganizatioUsersAPI,
  FetchOrganizationDetailsAPI,
} from "redux/actions";

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

  const projectManagers = useSelector(
    (state) => state.getOrganizatioProjectManagersUser.data
  );
  const orgUsers = useSelector((state) => state.getOrganizatioUsers.data);

  const filteredOrgUsers = (orgUsers || []).filter(
    (user) => user.role === "ORG_OWNER"
  );
  const userList = [...(projectManagers || []), ...filteredOrgUsers];

  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );
  const organizationDetails = useSelector(
    (state) => state.getOrganizationDetails.data
  );
  const apiStatus = useSelector((state) => state.apiStatus);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerUsername, setManagerUsername] = useState([]);
  const [transcriptSourceType, setTranscriptSourceType] =
    useState("MACHINE_GENERATED");
  const [translationSourceType, setTranslationSourceType] =
    useState("MACHINE_GENERATED");
  const [defaultTask, setDefaultTask] = useState([]);
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [voiceOverSourceType, setVoiceOverSourceType] =
    useState("MACHINE_GENERATED");
  const [paraphrase, setParaphrase] = useState(false);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "CREATE_NEW_PROJECT") {
          navigate(`/my-organization/${orgId}/project/${data.project_id}`, {
            replace: true,
          });
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

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

    const langObj = new FetchSupportedLanguagesAPI("TRANSLATION");
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
      paraphrase_enabled: paraphrase,
    };

    const apiObj = new CreateNewProjectAPI(newPrjectReqBody);
    dispatch(APITransport(apiObj));
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
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
              {userList?.map((name, index) => (
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

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Paraphrasing Stage
          </Typography>
          <FormControl fullWidth>
            <Select
              id="Voiceover-source-type"
              value={paraphrase}
              onChange={(event) => setParaphrase(event.target.value)}
              MenuProps={MenuProps}
            >
                <MenuItem key={1} value={false}>Disabled</MenuItem>
                <MenuItem key={2} value={true}>Enabled</MenuItem>
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
            style={{ borderRadius: "8px", margin: "0px 10px 0px 0px" }}
            onClick={() => handleCreateProject()}
            disabled={disableBtn()}
          >
            Create Project{" "}
            {apiStatus.loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>

          <Button
            variant="text"
            style={{ borderRadius: "8px" }}
            onClick={() => navigate(`/my-organization/${orgId}`)}
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default CreatenewProject;

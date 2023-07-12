import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Components
import {
  Box,
  Card,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Chip,
  Checkbox,
  Button,
  InputLabel,
  TextField,
} from "@mui/material";
import { Loader } from "common";

//APIs
import {
  CreateNewOrganizationAPI,
  FetchOrgOwnersAPI,
  FetchTranscriptTypesAPI,
  APITransport,
  FetchTranslationTypesAPI,
  FetchBulkTaskTypeAPI,
  FetchSupportedLanguagesAPI,
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

const CreateNewOrg = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orgOwnerList = useSelector((state) => state.getOrgOwnerList.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );
  const apiStatus = useSelector((state) => state.apiStatus);

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [emailDomainName, setEmailDomainName] = useState("");
  const [transcriptSourceType, setTranscriptSourceType] =
    useState("MACHINE_GENERATED");
  const [translationSourceType, setTranslationSourceType] =
    useState("MACHINE_GENERATED");
  const [defaultTask, setDefaultTask] = useState([]);
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [voiceOverSourceType, setVoiceOverSourceType] =
    useState("MACHINE_GENERATED");

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "CREATE_NEW_ORGANIZATION") {
          navigate(`/admin`, { replace: true });
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const disableBtn = () => {
    if (!title || !owner) {
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

  useEffect(() => {
    const apiObj = new FetchOrgOwnersAPI();
    dispatch(APITransport(apiObj));

    const transcriptObj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationTypesAPI();
    dispatch(APITransport(translationObj));

    const bulkTaskObj = new FetchBulkTaskTypeAPI();
    dispatch(APITransport(bulkTaskObj));

    const langObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(langObj));

    // eslint-disable-next-line
  }, []);

  const handleCreateOrganization = async () => {
    const reqBody = {
      title,
      email_domain_name: emailDomainName,
      organization_owner: owner,
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_voiceover_type: voiceOverSourceType,
    };

    const apiObj = new CreateNewOrganizationAPI(reqBody);
    dispatch(APITransport(apiObj));
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: "100%",
          minHeight: 500,
          padding: 5,
          border: 0,
        }}
      >
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Typography variant="h3" align="center">
              Create New Organization
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Owner</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={owner}
                label="Owner"
                onChange={(event) => setOwner(event.target.value)}
                MenuProps={MenuProps}
              >
                {orgOwnerList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.id}>
                      {item.email}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Domain Name"
              name="emailDomainName"
              value={emailDomainName}
              onChange={(e) => setEmailDomainName(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="translation-source-type">
                Select Transcription Source
              </InputLabel>
              <Select
                labelId="translation-source-type"
                id="translation-source-type_select"
                value={transcriptSourceType}
                label="Select Transcription Source"
                MenuProps={MenuProps}
                onChange={(event) =>
                  setTranscriptSourceType(event.target.value)
                }
              >
                {transcriptTypes.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="translation-source-type">
                Select Translation Source
              </InputLabel>
              <Select
                labelId="translation-source-type"
                id="translation-source-type_select"
                value={translationSourceType}
                label="Select Transcription Source"
                MenuProps={MenuProps}
                onChange={(event) =>
                  setTranslationSourceType(event.target.value)
                }
              >
                {translationTypes.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="translation-source-type">
                Select Voiceover Source
              </InputLabel>
              <Select
                labelId="translation-source-type"
                id="translation-source-type_select"
                value={voiceOverSourceType}
                label="Select Voiceover Source"
                MenuProps={MenuProps}
                onChange={(event) => setVoiceOverSourceType(event.target.value)}
              >
                {translationTypes.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="default_workflow">Default Workflow</InputLabel>
              <Select
                multiple
                labelId="default_workflow"
                id="default_workflow_select"
                value={defaultTask}
                label="Default Workflow"
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
          </Grid>

          {defaultTask.filter((item) => item.value.includes("TRANSLATION"))
            .length > 0 && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="targetlanguages">
                  Select Translation Language
                </InputLabel>
                <Select
                  multiple
                  labelId="targetlanguages"
                  id="targetlanguages_select"
                  value={translationLanguage}
                  name="targetlanguages"
                  label="Target Languages"
                  onChange={(e) => setTranslationLanguage(e.target.value)}
                  MenuProps={MenuProps}
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
            </Grid>
          )}

          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            style={{ padding: 32 }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleCreateOrganization()}
              style={{ borderRadius: "8px" }}
              disabled={disableBtn()}
            >
              Create Organization{" "}
              {apiStatus.loading && (
                <Loader size={20} margin="0 0 0 10px" color="secondary" />
              )}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CreateNewOrg;

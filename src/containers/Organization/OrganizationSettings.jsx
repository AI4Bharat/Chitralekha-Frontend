import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  defaultTaskHandler,
  diableTargetLang,
  getDisableOption,
  MenuProps,
} from "utils";

//Components
import {
  Button,
  Card,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Checkbox,
} from "@mui/material";
import { Loader } from "common";

//APIs
import {
  EditOrganizationDetailsAPI,
  FetchOrganizationDetailsAPI,
  FetchBulkTaskTypeAPI,
  FetchSupportedLanguagesAPI,
  FetchTranscriptTypesAPI,
  FetchTranslationTypesAPI,
  APITransport,
} from "redux/actions";

const OrganizationSettings = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orgInfo = useSelector((state) => state.getOrganizationDetails.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const apiStatus = useSelector((state) => state.apiStatus);

  const [orgDetails, setOrgDetails] = useState({
    title: "",
    emailDomainName: "",
  });
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [transcriptSourceType, setTranscriptSourceType] = useState("");
  const [translationSourceType, setTranslationSourceType] = useState("");
  const [defaultTask, setDefaultTask] = useState([]);
  const [voiceOverSourceType, setVoiceOverSourceType] = useState("");

  useEffect(() => {
    const orgObj = new FetchOrganizationDetailsAPI(id);
    dispatch(APITransport(orgObj));

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

  useEffect(() => {
    setOrgDetails({
      title: orgInfo.title,
      emailDomainName: orgInfo.email_domain_name,
    });

    setTranscriptSourceType(orgInfo?.default_transcript_type);
    setTranslationSourceType(orgInfo?.default_translation_type);
    setVoiceOverSourceType(orgInfo?.default_voiceover_type);

    if (orgInfo.default_task_types) {
      const items = bulkTaskTypes.filter((item) =>
        orgInfo.default_task_types.includes(item.value)
      );
      setDefaultTask(items);
    }

    if (orgInfo.default_target_languages) {
      const items = supportedLanguages.filter((item) =>
        orgInfo.default_target_languages.includes(item.value)
      );
      setTranslationLanguage(items);
    }
  }, [orgInfo, supportedLanguages, bulkTaskTypes]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setOrgDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    const body = {
      title: orgDetails.title,
      email_domain_name: orgDetails.emailDomainName,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_voiceover_type: voiceOverSourceType,
    };

    const userObj = new EditOrganizationDetailsAPI(id, body);
    dispatch(APITransport(userObj));
  };

  const showBtn = () => {
    const oldObj = {
      title: orgInfo.title,
      emailDomainName: orgInfo.email_domain_name,
      default_transcript_type: orgInfo.default_transcript_type,
      default_translation_type: orgInfo.default_translation_type,
      default_task_types: orgInfo.default_task_types,
      default_target_languages: orgInfo.default_target_languages,
      default_voiceover_type: orgInfo?.default_voiceover_type,
    };

    const newObj = {
      title: orgDetails.title,
      emailDomainName: orgDetails.emailDomainName,
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_voiceover_type: voiceOverSourceType,
    };

    if (JSON.stringify(oldObj) === JSON.stringify(newObj)) {
      return false;
    }

    return true;
  };

  const handleDefaultTask = (task) => {
    const { dTask, lang } = defaultTaskHandler(task);
    setDefaultTask(dTask);
    setTranslationLanguage(lang);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: "100%",
            minHeight: 500,
            padding: 5,
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Organization Settings
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Title"
                name="title"
                value={orgDetails?.title}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Email Domain Name"
                name="emailDomainName"
                value={orgDetails?.emailDomainName}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="transcription-source-type">
                  Transcription Source
                </InputLabel>
                <Select
                  labelId="transcription-source-type"
                  id="transcription-source-type_select"
                  value={transcriptSourceType}
                  label="Transcription Source"
                  MenuProps={MenuProps}
                  onChange={(event) =>
                    setTranscriptSourceType(event.target.value)
                  }
                  sx={{ textAlign: "left" }}
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
                  Translation Source
                </InputLabel>
                <Select
                  labelId="translation-source-type"
                  id="translation-source-type_select"
                  value={translationSourceType}
                  label="Translation Source"
                  MenuProps={MenuProps}
                  onChange={(event) =>
                    setTranslationSourceType(event.target.value)
                  }
                  sx={{ textAlign: "left" }}
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
                <InputLabel id="Voiceover-source-type">
                  Default Voiceover Source
                </InputLabel>
                <Select
                  labelId="Voiceover-source-type"
                  id="Voiceover-source-type_select"
                  value={voiceOverSourceType}
                  label="Default Voiceover Source"
                  MenuProps={MenuProps}
                  onChange={(event) =>
                    setVoiceOverSourceType(event.target.value)
                  }
                  sx={{ textAlign: "left" }}
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
                  onChange={(event) => handleDefaultTask(event.target.value)}
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
                    <MenuItem
                      key={index}
                      value={item}
                      disabled={getDisableOption(item, defaultTask)}
                    >
                      <Checkbox checked={defaultTask.indexOf(item) > -1} />
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="targetlanguages">Target Languages</InputLabel>
                <Select
                  multiple
                  labelId="targetlanguages"
                  id="targetlanguages_select"
                  value={translationLanguage}
                  name="targetlanguages"
                  label="Target Languages"
                  onChange={(e) => setTranslationLanguage(e.target.value)}
                  MenuProps={MenuProps}
                  disabled={diableTargetLang(defaultTask)}
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

            {showBtn() && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                style={{ marginTop: 20 }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleSubmit()}
                  style={{ borderRadius: 6 }}
                >
                  Update Organization{" "}
                  {apiStatus.loading && (
                    <Loader size={20} margin="0 0 0 10px" color="secondary" />
                  )}
                </Button>
              </Grid>
            )}
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default OrganizationSettings;

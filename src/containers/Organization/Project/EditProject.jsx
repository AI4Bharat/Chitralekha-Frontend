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
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import Loader from "../../../common/Spinner";
import EditProjectDetailsAPI from "../../../redux/actions/api/Project/EditProjectDetails";
import FetchBulkTaskTypeAPI from "../../../redux/actions/api/Project/FetchBulkTaskTypes";
import FetchPriorityTypesAPI from "../../../redux/actions/api/Project/FetchPriorityTypes";
import FetchProjectDetailsAPI from "../../../redux/actions/api/Project/FetchProjectDetails";
import FetchSupportedLanguagesAPI from "../../../redux/actions/api/Project/FetchSupportedLanguages";
import FetchTranscriptTypesAPI from "../../../redux/actions/api/Project/FetchTranscriptTypes";
import FetchTranslationTypesAPI from "../../../redux/actions/api/Project/FetchTranslationTypes";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import ProjectStyle from "../../../styles/ProjectStyle";
import { MenuProps } from "../../../utils/utils";

const EditProject = () => {
  const { projectId, orgId } = useParams();
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const PriorityTypes = useSelector((state) => state.getPriorityTypes.data);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
  });
  const [managers, setManagers] = useState([]);
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [transcriptSourceType, setTranscriptSourceType] = useState("");
  const [translationSourceType, setTranslationSourceType] = useState("");
  const [defaultTask, setDefaultTask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment().format());
  const [priority, setPriority] = useState({});

  useEffect(() => {
    const apiObj = new FetchProjectDetailsAPI(projectId);
    dispatch(APITransport(apiObj));

    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));

    const bulkTaskObj = new FetchBulkTaskTypeAPI();
    dispatch(APITransport(bulkTaskObj));

    const transcriptObj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationTypesAPI();
    dispatch(APITransport(translationObj));

    const priorityTypesObj = new FetchPriorityTypesAPI();
    dispatch(APITransport(priorityTypesObj));
  }, []);

  useEffect(() => {
    if (projectInfo.default_task_types) {
      const items = bulkTaskTypes.filter((item) =>
        projectInfo.default_task_types.includes(item.value)
      );
      setDefaultTask(items);
    }

    if (projectInfo.default_target_languages) {
      const items = supportedLanguages.filter((item) =>
        projectInfo.default_target_languages.includes(item.value)
      );
      setTranslationLanguage(items);
    }

    if (projectInfo.default_priority) {
      const items = PriorityTypes.filter(
        (item) => item.value === projectInfo.default_priority
      );
      setPriority(items[0]);
    }
  }, [projectInfo, supportedLanguages, bulkTaskTypes, PriorityTypes]);

  useEffect(() => {
    if (projectInfo && projectInfo.managers) {
      setProjectDetails(projectInfo);
      setManagers(projectInfo?.managers);
      setTranscriptSourceType(projectInfo?.default_transcript_type);
      setTranslationSourceType(projectInfo?.default_translation_type);
      setDate(projectInfo?.default_eta);
    }
  }, [projectInfo]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setProjectDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const updateProjectReqBody = {
      title: projectDetails.title,
      description: projectDetails.description,
      organization_id: orgId,
      managers_id: managers.map((item) => item.id),
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_task_eta: date,
      default_task_priority: priority.value,
    };

    const apiObj = new EditProjectDetailsAPI(updateProjectReqBody, projectId);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
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

  const showBtn = () => {
    const oldObj = {
      title: projectInfo.title,
      managers: projectInfo.managers,
      default_transcript_type: projectInfo.default_transcript_type,
      default_translation_type: projectInfo.default_translation_type,
      description: projectInfo.description,
      default_task_types: projectInfo.default_task_types,
      default_target_languages: projectInfo.default_target_languages,
      default_priority: projectInfo.default_priority,
      default_eta: projectInfo.default_eta,
    };

    const newObj = {
      title: projectDetails.title,
      managers: managers,
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      description: projectDetails.description,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_priority: priority?.value,
      default_eta: date,
    };

    if (JSON.stringify(oldObj) === JSON.stringify(newObj)) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {renderSnackBar()}
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
                Project Settings
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Title"
                name="title"
                value={projectDetails?.title}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Manager</InputLabel>
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={managers}
                  label="Manager"
                  onChange={(e) => setManagers(e.target.value)}
                  MenuProps={MenuProps}
                  renderValue={(selected) => {
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          return (
                            <Chip
                              key={value.id}
                              label={`${value.first_name} ${value.last_name}`}
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
                >
                  {projectDetails?.managers?.map((item) => {
                    return (
                      <MenuItem value={item}>
                        <Checkbox checked={managers.indexOf(item) > -1} />
                        {`${item.first_name} ${item.last_name}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
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

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DatePicker
                label="Default ETA"
                inputFormat="DD/MM/YYYY"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
                className={classes.datePicker}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="select-priority">Select Priority</InputLabel>
                <Select
                  fullWidth
                  labelId="select-priority"
                  label="Select Priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  renderValue={(selected) => {
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Chip key={selected.value} label={selected.label} />
                      </Box>
                    );
                  }}
                >
                  {PriorityTypes.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item?.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid container direction="row" padding="32px 0 0 32px">
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={projectDetails?.description}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
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
                  Update Project{" "}
                  {loading && (
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

export default EditProject;

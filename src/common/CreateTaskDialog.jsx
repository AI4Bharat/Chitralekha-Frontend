import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";

//Styles
import { ProjectStyle } from "styles";

//Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "./Spinner";
import WarningIcon from "@mui/icons-material/Warning";

//APIs
import {
  APITransport,
  FetchAllowedTasksAPI,
  FetchPriorityTypesAPI,
  FetchProjectMembersAPI,
  FetchSupportedLanguagesAPI,
  FetchTaskTypeAPI,
  FetchBulkTaskTypeAPI,
} from "redux/actions";

const CreateTaskDialog = ({
  open,
  handleUserDialogClose,
  createTaskHandler,
  videoDetails,
  isBulk,
  loading,
}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const tasklist = useSelector((state) => state.getTaskTypes.data);
  const allowedTasklist = useSelector((state) => state.getAllowedTasks.data);
  const PriorityTypes = useSelector((state) => state.getPriorityTypes.data);
  const translationLanguage = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );
  const voiceoverLanguage = useSelector(
    (state) => state.getSupportedLanguages.voiceoverLanguage
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);

  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [language, setLanguage] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(moment().format());
  const [allowedTaskType, setAllowedTaskType] = useState("");
  const [showAllowedTaskList, setShowAllowedTaskList] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    const taskObj = new FetchTaskTypeAPI();
    dispatch(APITransport(taskObj));

    const priorityTypesObj = new FetchPriorityTypesAPI();
    dispatch(APITransport(priorityTypesObj));

    const bulkTaskObj = new FetchBulkTaskTypeAPI();
    dispatch(APITransport(bulkTaskObj));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (taskType.length && !taskType.includes("TRANSCRIPTION")) {
      const langObj = new FetchSupportedLanguagesAPI(taskType);
      dispatch(APITransport(langObj));
    }
    // eslint-disable-next-line
  }, [taskType]);

  const submitHandler = () => {
    const obj = {
      task_type: isBulk ? taskType : allowedTaskType,
      user_id: user.id,
      target_language: language,
      eta: date,
      priority: priority,
      description: description,
      video_ids: Array.isArray(videoDetails)
        ? videoDetails.map((item) => item.id)
        : [videoDetails.id],
      is_single_task: !isBulk,
    };
    createTaskHandler(obj);
  };

  const selectTaskTypeHandler = (event) => {
    const {
      target: { value },
    } = event;

    setTaskType(value);

    if (videoDetails.length > 10) {
      value.includes("TRANSCRIPTION_EDIT")
        ? setShowLimitWarning(true)
        : setShowLimitWarning(false);
    }

    if (isBulk && value.includes("TRANSCRIPTION")) {
      const obj = new FetchProjectMembersAPI(projectId, value, "", "");
      dispatch(APITransport(obj));
    }

    if (!isBulk) {
      setShowAllowedTaskList(true);

      if (value === "TRANSCRIPTION") {
        const allowedTaskObj = new FetchAllowedTasksAPI(
          Array.isArray(videoDetails)
            ? videoDetails.map((item) => item.id)
            : videoDetails.id,
          value
        );
        dispatch(APITransport(allowedTaskObj));
      }
    }
  };

  const selectTranslationLanguageHandler = (event) => {
    const {
      target: { value },
    } = event;

    setLanguage(value);

    if (isBulk) {
      const obj = new FetchProjectMembersAPI(projectId, taskType, "", value);
      dispatch(APITransport(obj));
    }

    const allowedTaskObj = new FetchAllowedTasksAPI(
      Array.isArray(videoDetails)
        ? videoDetails.map((item) => item.id)
        : videoDetails.id,
      taskType,
      value
    );
    dispatch(APITransport(allowedTaskObj));
  };

  const selectAllowedTaskHandler = (value) => {
    setAllowedTaskType(value);

    const obj = new FetchProjectMembersAPI(
      projectId,
      value,
      videoDetails.id,
      language
    );
    dispatch(APITransport(obj));
  };

  const disableBtn = () => {
    if (!taskType || !allowedTaskType) {
      return true;
    }

    if (taskType.includes("TRANSLATION") && language.length <= 0) {
      return true;
    }

    return false;
  };

  const handleClear = () => {
    setTaskType("");
    setLanguage("");
    setAllowedTaskType("");
    setUser("");
    setDescription("");
    setPriority("");
    setDate(moment().format());
  };

  const isAssignUserDropdownDisabled = () => {
    if (!taskType) {
      return true;
    }

    if (isBulk) {
      if (taskType.includes("TRANSCRIPTION")) {
        return false;
      } else {
        if (!language) {
          return true;
        }
      }
    } else {
      if (taskType === "TRANSCRIPTION") {
        if (!allowedTaskType) {
          return true;
        }
      } else {
        if (!allowedTaskType || !language) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"sm"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4"> Create New Task</Typography>
        <IconButton
          aria-label="close"
          onClick={handleUserDialogClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ paddingTop: 4 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {showLimitWarning && (
            <Box display="flex" alignItems="center" marginRight="auto">
              <WarningIcon color="error" />
              <Typography
                variant="body2"
                fontWeight="bold"
                color="error"
                marginLeft="5px"
              >
                A maximum of 10 Transcription Edit tasks can be created
                simultaneously.
              </Typography>
            </Box>
          )}

          <Box width={"100%"} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="select-task">Select Task Type*</InputLabel>
              <Select
                labelId="select-task"
                label="Select Task Type"
                fullWidth
                value={taskType}
                onChange={(event) => selectTaskTypeHandler(event)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
              >
                {isBulk
                  ? bulkTaskTypes.map((item, index) => (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))
                  : tasklist.map((item, index) => (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>

          {(taskType.includes("TRANSLATION") ||
            taskType.includes("VOICEOVER")) && (
            <Box width={"100%"} sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="select-lang">
                  Select Translation Language
                </InputLabel>
                <Select
                  fullWidth
                  labelId="select-lang"
                  label="Select Translation Language"
                  value={language}
                  // onChange={(event) => setLanguage(event.target.value)}
                  onChange={(event) => selectTranslationLanguageHandler(event)}
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {taskType.includes("TRANSLATION")
                    ? translationLanguage?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))
                    : voiceoverLanguage?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {showAllowedTaskList && (
            <Box width={"100%"} sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="select-allowed-task">Select Action*</InputLabel>
                <Select
                  labelId="select-allowed-task"
                  label="Select Action"
                  fullWidth
                  value={allowedTaskType}
                  onChange={(event) =>
                    selectAllowedTaskHandler(event.target.value)
                  }
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {allowedTasklist.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Box width={"100%"} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="assign-user">Assign User</InputLabel>
              <Select
                labelId="assign-user"
                label="Assign User"
                fullWidth
                value={user}
                onChange={(event) => setUser(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                disabled={isAssignUserDropdownDisabled()}
              >
                {projectMembers.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {`${item.first_name} ${item.last_name} (${item.email})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box width={"100%"} sx={{ mt: 3 }}>
            <TextField
              label={"Description"}
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Box>

          <Box width={"100%"} sx={{ mt: 3 }}>
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
              >
                {PriorityTypes.map((item, index) => (
                  <MenuItem key={index} value={item?.value}>
                    {item?.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box width={"100%"} sx={{ mt: 3 }}>
            <DatePicker
              label="ETA"
              inputFormat="DD/MM/YYYY"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
              className={classes.datePicker}
            />
          </Box>
        </Grid>
      </DialogContent>

      <DialogActions style={{ padding: "24px 24px 24px 0" }}>
        <Button
          variant="outlined"
          sx={{ borderRadius: 2 }}
          onClick={() => handleClear()}
        >
          Clear
        </Button>

        <Button
          autoFocus
          variant="contained"
          sx={{ borderRadius: 2 }}
          disabled={isBulk ? showLimitWarning : disableBtn()}
          onClick={() => submitHandler()}
        >
          Create Task{" "}
          {loading && <Loader size={20} margin="0 0 0 5px" color="secondary" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;

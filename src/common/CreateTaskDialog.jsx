import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//APIs
import FetchProjectMembersAPI from "../redux/actions/api/Project/FetchProjectMembers";
import APITransport from "../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import ProjectStyle from "../styles/ProjectStyle";
import moment from "moment";
import FetchTaskTypeAPI from "../redux/actions/api/Project/FetchTaskTypes";
import FetchAllowedTasksAPI from "../redux/actions/api/Project/FetchAllowedTasks";
import FetchPriorityTypesAPI from "../redux/actions/api/Project/FetchPriorityTypes";
import FetchSupportedLanguagesAPI from "../redux/actions/api/Project/FetchSupportedLanguages";

const CreateTaskDialog = ({
  open,
  handleUserDialogClose,
  createTaskHandler,
  videoDetails,
}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const tasklist = useSelector((state) => state.getTaskTypes.data);
  const allowedTasklist = useSelector((state) => state.getAllowedTasks.data);
  const PriorityTypes = useSelector((state) => state.getPriorityTypes.data);
  const supportedLanguages = useSelector((state) => state.getSupportedLanguages.data);

  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [language, setLanguage] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(moment().format());
  const [allowedTaskType, setAllowedTaskType] = useState("");
  const [showAllowedTaskList, setShowAllowedTaskList] = useState(false);

  useEffect(() => {
    const taskObj = new FetchTaskTypeAPI();
    dispatch(APITransport(taskObj));

    const priorityTypesObj = new FetchPriorityTypesAPI();
    dispatch(APITransport(priorityTypesObj));
    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));
  }, []);

  const submitHandler = () => {
    const obj = {
      task_type: allowedTaskType,
      user_id: user.id,
      target_language: language,
      eta: date,
      priority: priority,
      description: description,
      video_id: videoDetails.id,
    };
    createTaskHandler(obj);
  };

  const selectTaskTypeHandler = (event) => {  
    setTaskType(event.target.value);
    setShowAllowedTaskList(true);

    const allowedTaskObj = new FetchAllowedTasksAPI(videoDetails.id, event.target.value);
    dispatch(APITransport(allowedTaskObj));
  }

  const selectAllowedTaskHandler = (value) => {
    setAllowedTaskType(value);

    const obj = new FetchProjectMembersAPI(projectId, value);
    dispatch(APITransport(obj));
  }

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
    >
      <DialogTitle variant="h4">Create New Task</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box width={"100%"} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="select-task">Select Task Type</InputLabel>
              <Select
                labelId="select-task"
                label="Select Task Type"
                fullWidth
                value={taskType}
                onChange={(event) => selectTaskTypeHandler(event)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
              >
                {tasklist.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {
            showAllowedTaskList && (
              <Box width={"100%"} sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="select-allowed-task">Select Action</InputLabel>
                  <Select
                    labelId="select-allowed-task"
                    label="Select Action"
                    fullWidth
                    value={allowedTaskType}
                    onChange={(event) => selectAllowedTaskHandler(event.target.value)}
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
            )
          }

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
              >
                {projectMembers.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.username}
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

          {(taskType === "TRANSLATION") && (
              <Box width={"100%"} sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="select-lang">Select Translation Language</InputLabel>
                  <Select
                    fullWidth
                    labelId="select-lang"
                    label="Select Translation Language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    style={{ zIndex: "0" }}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {supportedLanguages?.map((item, index) => (
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
              <InputLabel id="select-priority">Select Priority</InputLabel>
              <Select
                fullWidth
                labelId="select-priority"
                label="Select Priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value?.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
              >
                 {PriorityTypes.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.value}
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
        <Button autoFocus onClick={handleUserDialogClose}>
          Close
        </Button>
        <Button
          autoFocus
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => submitHandler()}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;

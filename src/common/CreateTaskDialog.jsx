import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { tasks } from "../utils/utils";
import { useParams } from "react-router-dom";

//APIs
import FetchProjectMembersAPI from "../redux/actions/api/Project/FetchProjectMembers";
import FetchLanguageAPI from "../redux/actions/api/Project/FetchLanguages";
import APITransport from "../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";

const CreateTaskDialog = ({
  open,
  handleUserDialogClose,
  createTaskHandler,
}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const languages = useSelector((state) => state.getLanguages.data.language);

  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const obj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(obj));

    const apiObj = new FetchLanguageAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const submitHandler = () => {
    const obj = {
      task_type: taskType,
      user_id: user.id,
    };
    createTaskHandler(obj);
  };

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
            <Typography gutterBottom component="div" label="Required">
              Select Task Type:
            </Typography>
            <Select
              fullWidth
              value={taskType}
              onChange={(event) => setTaskType(event.target.value)}
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
            >
              {tasks.map((item, index) => (
                <MenuItem key={index} value={item.type}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box width={"100%"} sx={{ mt: 3 }}>
            <Typography gutterBottom component="div" label="Required">
              Assign User:
            </Typography>
            <Select
              fullWidth
              labelId="lang-label"
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
          </Box>

          <Box width={"100%"} sx={{ mt: 3 }}>
            <Typography gutterBottom component="div" label="Required" multiline>
              Description:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Box>

          {(taskType === "TRANSLATION_SELECT_SOURCE" ||
            taskType === "TRANSLATION_EDIT" ||
            taskType === "TRANSLATION_REVIEW") && (
            <Box width={"100%"} sx={{ mt: 3 }}>
              <Typography gutterBottom component="div" label="Required">
                Select Language:
              </Typography>
              <Select
                fullWidth
                labelId="lang-label"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
              >
                {languages?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
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

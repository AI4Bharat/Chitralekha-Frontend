//Components
import { Card, Grid, MenuItem, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import OutlinedTextField from "../../../common/OutlinedTextField";
import Button from "../../../common/Button";

//Styles
import DatasetStyle from "../../../styles/Dataset";

//utils
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tasks } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";

//APIs
import FetchProjectMembersAPI from "../../../redux/actions/api/Project/FetchProjectMembers";
import FetchLanguageAPI from "../../../redux/actions/api/Project/FetchLanguages";
import APITransport from "../../../redux/actions/apitransport/apitransport";

const CreateNewTask = () => {
  const { orgId, projectId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const languages = useSelector((state) => state.getLanguages.data.language);

  const [taskType, setTaskType] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [language, setLanguage] = useState("");

  const handleCreateTask = () => {};

  useEffect(() => {
    const obj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(obj));

    const apiObj = new FetchLanguageAPI();
    dispatch(APITransport(apiObj));
  }, []);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Create a Task
        </Typography>

        <Box>
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

        <Box sx={{ mt: 3 }}>
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

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required" multiline>
            Description:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Box>

        {(taskType === "TRANSLATION_SELECT_SOURCE" ||
          taskType === "TRANSLATION_EDIT" ||
          taskType === "TRANSLATION_REVIEW") && (
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom component="div" label="Required">
              Select Language:
            </Typography>
            <Select
              fullWidth
              labelId="lang-label"
              name="participation_type"
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

        <Box sx={{ mt: 3 }}>
          <Button
            style={{ margin: "0px 20px 0px 0px" }}
            label={"Create Task"}
            onClick={() => handleCreateTask()}
          />
          <Button
            label={"Cancel"}
            onClick={() =>
              navigate(`/my-organization/${orgId}/project/${projectId}`)
            }
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default CreateNewTask;

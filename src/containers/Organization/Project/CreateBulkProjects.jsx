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
  Button,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { OutlinedTextField } from "common";

//APIs
import {
  APITransport,
  CreateBulkProjectsAPI,
  ProjectListAPI,
} from "redux/actions";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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

const CreateBulkProjects = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [template, setTemplate] = useState("");
  const [numberOfProjects, setNumberOfProjects] = useState(1);
  const [projectNames, setProjectNames] = useState([""]);

  const projectList = useSelector((state) => state.getProjectList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "CREATE_BULK_PROJECTS") {
          navigate(`/my-organization/${orgId}`, {
            replace: true,
          });
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const getProjectList = () => {
    const userObj = new ProjectListAPI(orgId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const handleNumProjectsChange = (e) => {
    const newNumProjects = parseInt(e.target.value, 10) || 1;
    const clampedNumProjects = Math.min(Math.max(newNumProjects, 1), 20);

    setNumberOfProjects(clampedNumProjects);

    setProjectNames((prevProjectNames) =>
      prevProjectNames.slice(0, clampedNumProjects)
    );
  };

  const handleProjectNameChange = (e, index) => {
    const newProjectNames = [...projectNames];
    newProjectNames[index] = e.target.value;
    setProjectNames(newProjectNames);
  };

  const handleAddProject = () => {
    setNumberOfProjects((prevNumProjects) => prevNumProjects + 1);
    setProjectNames((prevProjectNames) => [...prevProjectNames, ""]);
  };

  const handleRemoveProject = (index) => {
    setNumberOfProjects((prevNumProjects) => prevNumProjects - 1);
    setProjectNames((prevProjectNames) =>
      prevProjectNames.filter((_, i) => i !== index)
    );
  };

  const handleCreateProject = () => {
    const apiObj = new CreateBulkProjectsAPI(template, projectNames);
    dispatch(APITransport(apiObj));
  };

  const disableBtn = () => {
    const projects = projectNames.filter((item) => item !== "");

    if (numberOfProjects !== projects.length) {
      return true;
    }

    if (template.length <= 0) {
      return true;
    }

    return false;
  };

  return (
    <Grid container className={classes.bulkProjectContainer}>
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Create Bulk Project from a Template
        </Typography>

        <Grid container>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Number Of Projects</Typography>
            <OutlinedTextField
              fullWidth
              value={numberOfProjects}
              onChange={handleNumProjectsChange}
              sx={{ width: "95%" }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography gutterBottom>Project Template</Typography>
            <FormControl fullWidth>
              <Select
                id="template-name"
                value={template}
                onChange={(event) => setTemplate(event.target.value)}
                MenuProps={MenuProps}
              >
                {projectList.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container>
          {[...Array(numberOfProjects)].map((_, index) => {
            return (
              <>
                <Grid item xs={12} md={3} className={classes.newProjectWrapper}>
                  <Typography>Project {index + 1} Title</Typography>
                </Grid>

                <Grid item xs={12} md={7} sx={{ my: 1 }}>
                  <OutlinedTextField
                    fullWidth
                    value={projectNames[index]}
                    onChange={(e) => handleProjectNameChange(e, index)}
                  />
                </Grid>

                <Grid item xs={12} md={2} className={classes.newProjectWrapper}>
                  <Tooltip title="Add Project">
                    <IconButton
                      color="primary"
                      onClick={() => handleAddProject(index)}
                      sx={{
                        visibility: `${
                          index + 1 === numberOfProjects &&
                          numberOfProjects < 20
                            ? "visible"
                            : "hidden"
                        }`,
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Remove Project">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveProject(index)}
                      sx={{
                        visibility: `${
                          numberOfProjects !== 1 ? "visible" : "hidden"
                        }`,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </>
            );
          })}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            className={classes.bulkProjectButton}
            onClick={() => handleCreateProject()}
            disabled={disableBtn()}
          >
            Create Projects
          </Button>

          <Button
            variant="text"
            className={classes.bulkProjectButton}
            onClick={() => navigate(`/my-organization/${orgId}`)}
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default CreateBulkProjects;

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
} from "@mui/material";
import { Box } from "@mui/system";
import { OutlinedTextField } from "common";

//APIs
import {
  APITransport,
  CreateBulkProjectsAPI,
  ProjectListAPI,
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

const CreateBulkProjects = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [template, setTemplate] = useState("");
  const [numberOfProjects, setNumberOfProjects] = useState(1);
  const [projectNames, setProjectNames] = useState([]);

  const projectList = useSelector((state) => state.getProjectList.data);

  const getProjectList = () => {
    const userObj = new ProjectListAPI(orgId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const handleNumProjectsChange = (e) => {
    const newNumProjects = parseInt(e.target.value, 10) || 1;
    setNumberOfProjects(newNumProjects);

    setProjectNames((prevProjectNames) =>
      prevProjectNames.slice(0, newNumProjects)
    );
  };

  const handleProjectNameChange = (e, index) => {
    const newProjectNames = [...projectNames];
    newProjectNames[index] = e.target.value;
    setProjectNames(newProjectNames);
  };

  const handleAddProject = () => {
    setNumberOfProjects((prevNumProjects) => prevNumProjects + 1);
  };

  const handleCreateProject = () => {
    const apiObj = new CreateBulkProjectsAPI(template, projectNames);
    dispatch(APITransport(apiObj));
  };

  const disableBtn = () => {
    if (numberOfProjects !== projectNames.length) {
      return true;
    }

    if (template.length <= 0) {
      return true;
    }

    return false;
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Create Bulk Project from a Template
        </Typography>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom component="div" label="Required">
              Project Template
            </Typography>
            <FormControl fullWidth>
              <Select
                id="template-name"
                value={template}
                onChange={(event) => setTemplate(event.target.value)}
                MenuProps={MenuProps}
                sx={{ width: "95%" }}
              >
                {projectList.map((element, index) => (
                  <MenuItem key={index} value={element.id}>
                    {element.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom component="div" label="Required" multiline>
              Number Of Projects
            </Typography>
            <OutlinedTextField
              fullWidth
              value={numberOfProjects}
              onChange={handleNumProjectsChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container>
          {[...Array(numberOfProjects)].map((_, index) => {
            return (
              <Grid item xs={12} md={12} sx={{ my: 1 }}>
                <Typography gutterBottom component="div" label="Required">
                  Project {index + 1} Title
                </Typography>
                <OutlinedTextField
                  fullWidth
                  value={projectNames[index]}
                  onChange={(e) => handleProjectNameChange(e, index)}
                />
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            style={{ borderRadius: "8px", margin: "0px 10px 0px 0px" }}
            onClick={() => handleAddProject()}
          >
            Add New
          </Button>

          <Button
            color="primary"
            variant="contained"
            style={{ borderRadius: "8px", margin: "0px 10px 0px 0px" }}
            onClick={() => handleCreateProject()}
            disabled={disableBtn()}
          >
            Create Projects
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

export default CreateBulkProjects;

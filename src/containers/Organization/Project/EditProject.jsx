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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import FetchProjectDetailsAPI from "../../../redux/actions/api/Project/FetchProjectDetails";
import APITransport from "../../../redux/actions/apitransport/apitransport";

const EditProject = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const projectInfo = useSelector((state) => state.getProjectDetails.data);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const apiObj = new FetchProjectDetailsAPI(projectId);
    dispatch(APITransport(apiObj));
  }, []);

  useEffect(() => {
    setProjectDetails(projectInfo);
  }, [projectInfo]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setProjectDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {};

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
                Edit Project
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
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={12}
                  label="Manager"
                  onChange={() => {}}
                >
                  {projectDetails?.managers?.map((item) => {
                    return <MenuItem value={10}>{item.first_name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Default Transcript Source"
                name="default_transcript_source"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Default Translation Source"
                name="default_translation_source"
                value={projectDetails?.username}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="default_workflow">Default Workflow</InputLabel>
                <Select
                  labelId="default_workflow"
                  id="default_workflow_select"
                  value={12}
                  label="Default Workflow"
                  onChange={() => {}}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="targetlanguages">Target Languages</InputLabel>
                <Select
                  labelId="targetlanguages"
                  id="targetlanguages_select"
                  value={12}
                  name="targetlanguages"
                  label="Target Languages"
                  onChange={() => {}}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              style={{ marginTop: 20 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update Project
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default EditProject;

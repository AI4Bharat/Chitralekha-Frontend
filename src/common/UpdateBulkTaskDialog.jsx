import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

//Components
import {
  Box,
  Button,
  Chip,
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
import CustomizedSnackbars from "../common/Snackbar";

//Styles
import ProjectStyle from "../styles/ProjectStyle";

//APIs
import APITransport from "../redux/actions/apitransport/apitransport";
import FetchPriorityTypesAPI from "../redux/actions/api/Project/FetchPriorityTypes";
import Loader from "./Spinner";
import FetchTaskDetailsAPI from "../redux/actions/api/Project/FetchTaskDetails";
import FetchProjectMembersAPI from "../redux/actions/api/Project/FetchProjectMembers";
import { useParams } from "react-router";

const UpdateBulkTaskDialog = ({
  open,
  handleUserDialogClose,
  loading,
  handleUpdateTask,
  selectedTaskId,
  isBulk,
}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const PriorityTypes = useSelector((state) => state.getPriorityTypes.data);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);

  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(moment().format());
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const priorityTypesObj = new FetchPriorityTypesAPI();
    dispatch(APITransport(priorityTypesObj));

    if (isBulk) {
      const userObj = new FetchProjectMembersAPI(projectId);
      dispatch(APITransport(userObj));
    }

    if (!isBulk) {
      const taskObj = new FetchTaskDetailsAPI(selectedTaskId);
      dispatch(APITransport(taskObj));

      const userObj = new FetchProjectMembersAPI(projectId, taskDetails.task_type);
      dispatch(APITransport(userObj));
    }
  }, []);

  useEffect(() => {
    if (
      !isBulk &&
      taskDetails.description &&
      taskDetails.priority &&
      taskDetails.eta &&
      taskDetails?.user
    ) {
      setDescription(taskDetails.description);
      setPriority(taskDetails.priority);
      setDate(taskDetails.eta);

      const items = projectMembers.filter(
        (item) => item.id === taskDetails?.user?.id
      );
      setUser(items[0]);
    }
  }, [taskDetails, isBulk]);

  const submitHandler = () => {
    const data = {
      user,
      priority,
      description,
      date,
    };

    handleUpdateTask(data);
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

  return (
    <>
      {renderSnackBar()}
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleUserDialogClose}
        close
        maxWidth={"md"}
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4">
          {isBulk ? "Update Tasks" : "Update Task"}
        </DialogTitle>
        <DialogContent style={{ paddingTop: 4 }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
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
                  renderValue={(selected) => {
                    return <Chip key={selected.id} label={selected.username} />;
                  }}
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
          <Button autoFocus onClick={handleUserDialogClose}>
            Close
          </Button>
          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={() => submitHandler()}
          >
            {isBulk ? "Update Tasks" : "Update Task"}
            {loading && (
              <Loader size={20} margin="0 0 0 5px" color="secondary" />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBulkTaskDialog;

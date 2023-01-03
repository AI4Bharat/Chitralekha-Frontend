import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

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

const UpdateBulkTaskDialog = ({
  open,
  handleUserDialogClose,
  currentSelectedTasks,
}) => {
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const projectMembers = useSelector((state) => state.getProjectMembers.data);
  const PriorityTypes = useSelector((state) => state.getPriorityTypes.data);

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
  }, []);

  const submitHandler = () => {};

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
      >
        <DialogTitle variant="h4">Update Tasks</DialogTitle>
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
            Update Tasks
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBulkTaskDialog;

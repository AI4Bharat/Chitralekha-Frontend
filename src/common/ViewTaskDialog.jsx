import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { transcriptSelectSource } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import FetchTaskDetailsAPI from "../redux/actions/api/Project/FetchTaskDetails";
import APITransport from "../redux/actions/apitransport/apitransport";
import { useNavigate } from 'react-router-dom';
import moment from "moment/moment";

const ViewTaskDialog = ({ open, handleClose, submitHandler, id }) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [transcriptSource, setTranscriptSource] = useState([]);
  const [file, setFile] = useState();
  const [openTaskVideo, setopenTaskVideo] = useState(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState({});

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTranscriptSource(typeof value === "string" ? value.split(",") : value);
  };

  const taskDetail = useSelector((state) => state.getTaskDetails.data);

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(id);
    dispatch(APITransport(apiObj));
  }, []);

  return (
    <>
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent sx={{ p: 5 }}>
        <Box display="flex" sx={{ mb: 3 }}>
          <Typography variant="h5" width={"25%"}>
            Task Type:
          </Typography>
          <Typography variant="body1">{taskDetail.task_type}</Typography>
        </Box>

        <Box display="flex" sx={{ mb: 3 }}>
          <Typography variant="h5" width={"25%"}>
            Description:
          </Typography>
          <Typography variant="body1" width={"70%"} textAlign="justify">
            {taskDetail.description}
          </Typography>
        </Box>

        <Box display="flex" sx={{ mb: 3 }}>
          <Typography variant="h5" width={"25%"}>
            ETA:
          </Typography>
          <Typography variant="body1">
            {moment(taskDetail.eta).format("DD/MM/YYYY")}
          </Typography>
        </Box>

        <Box display="flex" sx={{ mb: 3 }}>
          <Typography variant="h5" width={"25%"}>
            Transcript Select Source:
          </Typography>
          <FormControl style={{ width: "70%" }}>
            <Select
              fullWidth
              width="100%"
              id="demo-multiple-checkbox"
              multiple
              value={transcriptSource}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => selected.join(", ")}
              inputProps={{ "aria-label": "Without label" }}
            >
              {transcriptSelectSource.map((item, index) => (
                <MenuItem key={index} value={item}>
                  <Checkbox checked={transcriptSource.indexOf(item) > -1} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {transcriptSource.includes("Manually Uploaded") && (
          <Box display="flex" sx={{ mb: 3 }} alignItems="center">
            <Typography variant="h5" width={"25%"}>
              Upload SRT:
            </Typography>
            <Typography variant="body1" width="70%">
              <TextField
                sx={{ width: "100%" }}
                disabled
                value={file?.name}
                InputProps={{
                  endAdornment: (
                    <label htmlFor="btn-upload" style={{ width: "30%" }}>
                      <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: "none" }}
                        type="file"
                        onChange={(event) => setFile(event.target.files[0])}
                      />
                      <Button
                        variant="contained"
                        component="span"
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                        }}
                      >
                        Choose Files
                      </Button>
                    </label>
                  ),
                }}
              />
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions style={{ padding: "24px" }}>
        <Button
          autoFocus
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => handleClose(true)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => submitHandler(id,transcriptSource)}
        >
          Compare
        </Button>
      </DialogActions>
    </Dialog>
   </>
  );
};

export default ViewTaskDialog;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

//Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";

//APIs
import {
  FetchTaskDetailsAPI,
  FetchTranscriptTypesAPI,
  APITransport,
  FetchTranslationTypesAPI,
  ImportSubtitlesAPI,
} from "redux/actions";

const ViewTaskDialog = ({
  open,
  handleClose,
  compareHandler,
  id,
  snackbar,
  setSnackbarInfo,
  fetchTaskList,
}) => {
  const dispatch = useDispatch();

  const [transcriptSource, setTranscriptSource] = useState([]);
  const [file, setFile] = useState();
  const [dropDownText, setdropDownText] = useState("");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTranscriptSource(typeof value === "string" ? value.split(",") : value);
  };

  const taskDetail = useSelector((state) => state.getTaskDetails.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const TranslationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );

  const transcriptTranslationType =
    taskDetail.task_type === "TRANSCRIPTION_EDIT"
      ? transcriptTypes
      : TranslationTypes;

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(id);
    dispatch(APITransport(apiObj));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (taskDetail.task_type === "TRANSCRIPTION_EDIT") {
      setdropDownText("Transcription");
      const obj = new FetchTranscriptTypesAPI();
      dispatch(APITransport(obj));
    } else {
      setdropDownText("Translation");
      const obj = new FetchTranslationTypesAPI();
      dispatch(APITransport(obj));
    }
    // eslint-disable-next-line
  }, [taskDetail]);

  const uploadFileHandler = async () => {
    const apiObj = new ImportSubtitlesAPI(id, file);
    dispatch(APITransport(apiObj));

    setTimeout(() => {
      fetchTaskList();
      handleClose();
    }, 1000);
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogContent sx={{ p: 5 }}>
          <Box display="flex" sx={{ mb: 3 }}>
            <Typography variant="h5" width={"20%"}>
              Task Type :
            </Typography>
            <Typography variant="body1">{taskDetail.task_type}</Typography>
          </Box>

          <Box display="flex" sx={{ mb: 3 }}>
            <Typography variant="h5" width={"20%"}>
              Description :
            </Typography>
            <Typography variant="body1" width={"70%"} textAlign="justify">
              {taskDetail.description}
            </Typography>
          </Box>

          <Box display="flex" sx={{ mb: 3 }}>
            <Typography variant="h5" width={"20%"}>
              ETA :
            </Typography>
            {taskDetail.eta && (
              <Typography variant="body1">
                {moment(taskDetail.eta).format("DD/MM/YYYY")}
              </Typography>
            )}
          </Box>

          {!taskDetail?.source_type?.includes("Manually Uploaded") && (
            <Box display="flex" sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                width={"20%"}
                style={{ marginTop: "12px" }}
              >
                Select :
              </Typography>
              <FormControl style={{ width: "70%" }}>
                <InputLabel id="select-transcription-source">
                  {" "}
                  {dropDownText} Source
                </InputLabel>
                <Select
                  fullWidth
                  width="100%"
                  labelId="select-transcription-source"
                  multiple
                  value={transcriptSource}
                  onChange={handleChange}
                  input={
                    <OutlinedInput label={`Select ${dropDownText} Source`} />
                  }
                  renderValue={(selected) => selected.join(", ")}
                  style={{ zIndex: 0 }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {transcriptTranslationType.map((item, index) => (
                    <MenuItem key={index} value={item.label}>
                      <Checkbox
                        checked={transcriptSource.indexOf(item.label) > -1}
                      />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* <Box display="flex" sx={{ mb: 3 }}>
            <Typography variant="h5" width={"25%"}>
              ETA:
            </Typography>
            {
              taskDetail.eta && (
                <Typography variant="body1">
                  {moment(taskDetail.eta).format("DD/MM/YYYY")}
                </Typography>
              )
            }
          </Box> */}

          {/* <Box display="flex" sx={{ mb: 3 }}>
            <Typography variant="h5" width={"25%"}>
              Select {taskDetail.task_type === "TRANSCRIPTION_EDIT" ? "Transcription" : "Translation"} Source:
            </Typography>
            <FormControl style={{ width: "70%" }}>
              <InputLabel id="select-transcription-source">Select {taskDetail.task_type === "TRANSCRIPTION_EDIT" ? "Transcription" : "Translation"} Source</InputLabel>
              <Select
                fullWidth
                width="100%"
                labelId="select-transcription-source"
                multiple={taskDetail.task_type === "TRANSCRIPTION_EDIT"}
                value={transcriptSource}
                onChange={handleChange}
                input={<OutlinedInput label="Select Transcription Source" />}
                renderValue={(selected) => selected.join(", ")}
                style={{ zIndex: 0 }}
                inputProps={{ "aria-label": "Without label" }}
              >
                {transcriptTypes.map((item, index) => (
                  <MenuItem key={index} value={item.label}>
                    <Checkbox checked={transcriptSource.indexOf(item.label) > -1} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box> */}

          {(transcriptSource.includes("Manually Uploaded") ||
            taskDetail?.source_type?.includes("Manually Uploaded")) && (
            <Box display="flex" sx={{ mb: 3 }} alignItems="center">
              <Typography variant="h5" width={"20%"}>
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
          {taskDetail?.source_type?.includes("Manually Uploaded") &&
            taskDetail?.is_active && (
              <Box sx={{ marginRight: "auto" }}>
                <Typography variant="body2" fontWeight={"bold"}>
                  *Subtitles have already been added, uploading new file will
                  overwrite existing one.
                </Typography>
              </Box>
            )}

          <Button
            autoFocus
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={() => handleClose(true)}
          >
            Cancel
          </Button>
          {taskDetail?.source_type?.includes("Manually Uploaded") ? (
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={() => uploadFileHandler()}
            >
              Upload
            </Button>
          ) : (
            <>
              {taskDetail.task_type === "TRANSCRIPTION_EDIT" && (
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={() => compareHandler(id, transcriptSource, false)}
                >
                  Compare
                </Button>
              )}
              {taskDetail.task_type === "TRANSLATION_EDIT" && (
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={() => compareHandler(id, transcriptSource, true)}
                >
                  Submit
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewTaskDialog;

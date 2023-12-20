import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MenuProps } from "utils";
import { speakerFields, voiceOptions } from "config";

//Styles
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideoTaskList from "containers/Organization/Project/VideoTaskList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

//APIs
import C from "redux/constants";
import {
  FetchVideoDetailsAPI,
  APITransport,
  UpdateVideoAPI,
} from "redux/actions";
import CustomizedSnackbars from "./Snackbar";

const VideoDialog = ({ open, handleClose, videoDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [speakerType, setSpeakerType] = useState(
    videoDetails[0].multiple_speaker ? "multiple" : "individual"
  );
  const [videoDescription, setVideoDescription] = useState("");
  const [voice, setVoice] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [speakerInfo, setSpeakerInfo] = useState(videoDetails[0].speaker_info);

  useEffect(() => {
    setVideoDescription(videoDetails[0].description);
    setVoice(videoDetails[0].gender_label);
  }, [videoDetails]);

  const handleRemoveSpeaker = (event, index) => {
    event.stopPropagation();

    const temp = [...speakerInfo];
    temp.splice(index, 1);

    setSpeakerInfo(temp);
  };

  const handleSpeakerFieldChange = (event, index) => {
    const {
      target: { name, value },
    } = event;

    const temp = [...speakerInfo];

    if (name === "name") {
      const spaceIndex = value.indexOf(" ");

      if (spaceIndex !== -1) {
        temp[index]["id"] = value.substring(0, spaceIndex);
      } else {
        temp[index]["id"] = value;
      }
    }
    temp[index][name] = value;

    setSpeakerInfo(temp);
  };

  const handleAddMoreSpeakers = () => {
    setSpeakerInfo((prevState) => [
      ...prevState,
      {
        name: "",
        gender: "",
        age: "",
        id: "",
      },
    ]);
  };

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoDetails[0].url,
      videoDetails[0].language,
      videoDetails[0].project_id,
      videoDetails[0].audio_only
    );
    dispatch(APITransport(apiObj));

    return () => {
      dispatch({ type: C.CLEAR_VIDEO_DETAILS });
    };
    // eslint-disable-next-line
  }, []);

  const updateVideoHandler = async () => {
    let updateData = {
      gender: voice,
      description: videoDescription,
      video_id: videoDetails[0].id,
      multiple_speaker: String(speakerType !== "individual"),
    };

    if (speakerType !== "individual") {
      updateData = {
        ...updateData,
        speaker_info: speakerInfo,
      };
    }

    const apiObj = new UpdateVideoAPI(updateData);
    dispatch(APITransport(apiObj));
  };

  const renderSnackBar = useCallback(() => {
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
  }, [snackbar]);

  return (
    <>
      {renderSnackBar()}

      <Dialog
        fullScreen={fullScreen}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        scroll="paper"
        PaperProps={{
          style: {
            overflowY: "hidden",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          display="flex"
          alignItems={"center"}
        >
          <Tooltip title={videoDetails[0].name}>
            <Typography
              variant="h4"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {videoDetails[0].name}
            </Typography>
          </Tooltip>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            width={"100%"}
            alignItems="center"
            marginBottom="20px"
          >
            <Grid margin="auto" width="100%">
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="select-voice">Voice Selection</InputLabel>
                <Select
                  fullWidth
                  labelId="select-voice"
                  label="Voice Selection"
                  value={voice}
                  onChange={(event) => setVoice(event.target.value)}
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                >
                  {voiceOptions?.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <RadioGroup
                  row
                  name="controlled-radio-buttons-group"
                  value={speakerType}
                  onChange={(event) => setSpeakerType(event.target.value)}
                >
                  <FormControlLabel
                    value="individual"
                    control={<Radio />}
                    label="Individual Speaker"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "18px" },
                    }}
                  />

                  <FormControlLabel
                    value="multiple"
                    control={<Radio />}
                    label="Multi Speaker"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "18px" },
                    }}
                  />
                </RadioGroup>
                {speakerType === "multiple" && (
                  <>
                    {speakerInfo.map((item, index) => {
                      return (
                        <Accordion
                          sx={{
                            borderRadius: "4px",
                            mt: 2,
                            "&:before": {
                              display: "none",
                            },
                            backgroundColor:
                              index % 2 === 0 ? "#D6EAF8" : "#E9F7EF",
                          }}
                          key={`speakerInfo-accordion-${index}`}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id={`speakerInfo-accordion-child-${index}`}
                          >
                            <Typography
                              sx={{ margin: "4px 0", color: "#2A2A2A" }}
                            >
                              Speaker {index + 1}
                            </Typography>

                            <Tooltip title="Delete Speaker">
                              <IconButton
                                aria-label="close"
                                onClick={(event) =>
                                  handleRemoveSpeaker(event, index)
                                }
                                sx={{ marginLeft: "auto" }}
                                disabled={speakerInfo.length === 1}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </AccordionSummary>
                          <AccordionDetails>
                            {speakerFields.map((element, idx) => {
                              return (
                                <Fragment key={`speaker-fields-${idx}`}>
                                  {element.type === "text" ? (
                                    <TextField
                                      label={element.label}
                                      value={item[element.name]}
                                      name={element.name}
                                      onChange={(event) =>
                                        handleSpeakerFieldChange(event, index)
                                      }
                                      sx={element.sx}
                                    />
                                  ) : (
                                    <FormControl fullWidth sx={element.sx}>
                                      <InputLabel id={element.label}>
                                        {element.label}
                                      </InputLabel>
                                      <Select
                                        fullWidth
                                        labelId={element.label}
                                        label={element.label}
                                        name={element.name}
                                        value={item[element.name]}
                                        onChange={(event) =>
                                          handleSpeakerFieldChange(event, index)
                                        }
                                        style={{ zIndex: "0" }}
                                        inputProps={{
                                          "aria-label": "Without label",
                                        }}
                                        MenuProps={MenuProps}
                                      >
                                        {element.options.map((item, index) => (
                                          <MenuItem
                                            key={index}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                </Fragment>
                              );
                            })}
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}

                    <Button
                      variant="text"
                      sx={{
                        display: "flex",
                        mt: 2,
                        borderRadius: 2,
                        lineHeight: 1,
                        ml: "auto",
                      }}
                      onClick={handleAddMoreSpeakers}
                    >
                      <AddIcon />
                      Add More Speakers
                    </Button>
                  </>
                )}
              </FormControl>
              <TextField
                id="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={videoDescription}
                onChange={(event) => setVideoDescription(event.target.value)}
                sx={{ mb: 3, mt: 3 }}
              />

              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  borderRadius: "8px",
                  m: "0 auto 0 0",
                }}
                onClick={() => updateVideoHandler()}
              >
                Update Details
              </Button>
            </Grid>
          </Grid>

          <div>
            <VideoTaskList videoDetails={videoDetails[0].id} />
          </div>
        </DialogContent>

        <DialogActions style={{ padding: "24px" }}></DialogActions>
      </Dialog>
    </>
  );
};

export default VideoDialog;

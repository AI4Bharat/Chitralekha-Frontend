import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "utils";

//Components
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Loader from "./Spinner";

//Icons
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

// Utils
import getLocalStorageData from "utils/getLocalStorageData";

// Config
import { specialOrgIds } from "config";

//Redux
import { APITransport, FetchSupportedLanguagesAPI } from "redux/actions";
import { speakerFields, voiceOptions } from "config";

const CreateVideoDialog = ({
  open,
  handleUserDialogClose,
  addBtnClickHandler,
  videoLink,
  setVideoLink,
  isAudio,
  setIsAudio,
  lang,
  setLang,
  videoDescription,
  setVideoDescription,
  voice,
  setVoice,
  setSpeakerInfo,
  speakerInfo,
  speakerType,
  setSpeakerType,
  duration,
  setDuration,
  youtubeUrl,
  setYoutubeUrl,
}) => {
  const userOrgId = getLocalStorageData("userData").organization.id;

  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI("TRANSCRIPTION");
    dispatch(APITransport(langObj));
    // eslint-disable-next-line
  }, []);

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.transcriptionLanguage
  );

  const videosInProject = useSelector((state)=>state.getProjectVideoList.data)
  const [showPopup, setShowPopup] = useState(false);
  const [showYoutubeUrl, setShowYoutubeUrl] = useState(false);
  const [showDurationSelector, setDurationSelector] = useState(false);
  useEffect(() => {
    if (videosInProject.some((video) => video.url === videoLink)) {
      setShowPopup(true);
    }
    if (videoLink.length > 10 & !videoLink.includes("youtube")){
      if(youtubeUrl.includes("youtube.com")){
        setDurationSelector(false);
      }else{
        setDurationSelector(true);
      }
    }else{
      setDurationSelector(false);
    }
    if (videoLink.includes("drive.google.com") || videoLink.includes("objectstore.e2enetworks.net") || videoLink.includes("blob.core.windows.net")){
      setShowYoutubeUrl(true);
    }else{
      setShowYoutubeUrl(false);
    }
  }, [videoLink, videosInProject, youtubeUrl]);
  
  const handleClear = () => {
    setLang("");
    setVideoLink("");
    setVoice("");
    setVideoDescription("");
    setSpeakerType("multiple");
    setSpeakerInfo([
      {
        name: "",
        gender: "",
        age: "",
        id: "",
      },
    ]);
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

  const isDisabled = () => {
    if (!lang.length || !videoLink.length) {
      return true;
    }

    if (speakerType === "multiple") {
      const isEmptyKeyPresent = speakerInfo.some((obj) => {
        return Object.values(obj).some((value) => {
          return value === "";
        });
      });

      if (isEmptyKeyPresent) {
        return true;
      }

      const idSet = new Set();

      for (const item of speakerInfo) {
        if (idSet.has(item.id)) {
          return true;
        }
        idSet.add(item.id);
      }
    }

    return false;
  };

  const handleRemoveSpeaker = (event, index) => {
    event.stopPropagation();

    const temp = [...speakerInfo];
    temp.splice(index, 1);

    setSpeakerInfo(temp);
  };

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Create New Video/Audio</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleUserDialogClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ paddingTop: 4 }}>
        <FormControl fullWidth>
          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={isAudio}
            onChange={(event) => setIsAudio(event.target.value)}
          >
            <Tooltip title="Supported Formats: Youtube Link">
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Import Video"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "18px" } }}
              />
            </Tooltip>

            <Tooltip title="Supported Formats: mp3">
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Import Audio"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "18px" } }}
              />
            </Tooltip>
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="select-Language">Select Language</InputLabel>
          <Select
            fullWidth
            labelId="select-Language"
            label="Select Language"
            value={lang}
            onChange={(event) => setLang(event.target.value)}
            style={{ zIndex: "0" }}
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={MenuProps}
          >
            {supportedLanguages?.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={"Enter Audio/Video Link"}
          fullWidth
          rows={1}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mt: 3 }}
        />
        
        {showYoutubeUrl &&
          <TextField
            label={"Enter YouTube Url"}
            fullWidth
            rows={1}
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            sx={{ mt: 3 }}
          />}

        {showDurationSelector &&
          <TextField
            label={"Video Duration"}
            fullWidth
            defaultValue="00:00:00"
            rows={1}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            sx={{ mt: 3 }}
          />}
        {showPopup && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        position: 'relative',
        minWidth: '300px',
      }}
    >
      <p>This video already exists in the project. Do you want to upload it again?</p>
      <Button
                  style={{ marginRight: "10px" }}
                  // className={classes.projectButton}
                  onClick={()=>setShowPopup(false)}
                  variant="contained"
                >
                  Yes
                </Button>

                <Button
                  style={{ marginRight: "10px" }}
                  // className={classes.projectButton}
                  onClick={()=>{setShowPopup(false)
                    setVideoLink("")
                  }}
                  variant="contained"
                >
                  No
                </Button>
    </div>
  </div>
)}


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

        <Divider sx={{ mt: 3 }} />

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
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "18px" } }}
            />

            <FormControlLabel
              value="multiple"
              control={<Radio />}
              label="Multi Speaker"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "18px" } }}
            />
          </RadioGroup>
        </FormControl>

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
                    backgroundColor: index % 2 === 0 ? "#D6EAF8" : "#E9F7EF",
                  }}
                  key={`speakerInfo-accordion-${index}`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`speakerInfo-accordion-child-${index}`}
                  >
                    <Typography sx={{ margin: "4px 0", color: "#2A2A2A" }}>
                      Speaker {index + 1}
                    </Typography>

                    <Tooltip title="Delete Speaker">
                      <IconButton
                        aria-label="close"
                        onClick={(event) => handleRemoveSpeaker(event, index)}
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
                                inputProps={{ "aria-label": "Without label" }}
                                MenuProps={MenuProps}
                              >
                                {element.options.map((item, index) => (
                                  <MenuItem key={index} value={item.value}>
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

        <Divider sx={{ mt: 3 }} />

        <TextField
          label="Description"
          required={specialOrgIds.includes(userOrgId) ? true : false}
          fullWidth
          multiline
          rows={3}
          value={videoDescription}
          onChange={(event) => setVideoDescription(event.target.value)}
          sx={{ mb: 3, mt: 3 }}
        />
      </DialogContent>

      <DialogActions
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 24px 24px 24px",
        }}
      >
        <Box>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, margin: "0 10px" }}
            onClick={() => handleClear()}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 2, lineHeight: 1 }}
            onClick={() => addBtnClickHandler()}
            disabled={isDisabled()}
          >
            Create{" "}
            {apiStatus.progress && <Loader size={20} margin="0 0 0 5px" />}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVideoDialog;

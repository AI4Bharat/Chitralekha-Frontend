import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchSupportedLanguagesAPI from "../redux/actions/api/Project/FetchSupportedLanguages";
import APITransport from "../redux/actions/apitransport/apitransport";
import Loader from "./Spinner";
import { MenuProps } from "../utils/utils";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const voiceOptions = [
  {
    label: "Male - Adult",
    value: "Male",
  },
  {
    label: "Female - Adult",
    value: "Female",
  },
];

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
}) => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));
    // eslint-disable-next-line
  }, []);

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  const handleClear = () => {
    setLang("");
    setVideoLink("");
    setVoice("");
    setVideoDescription("");
  };

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"sm"}
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
              />
            </Tooltip>

            <Tooltip title="Supported Formats: mp3">
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Import Audio"
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
          label={" Enter Audio/Video Link"}
          fullWidth
          multiline
          rows={1}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mt: 3 }}
        />

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

        <TextField
          label="Description"
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
            sx={{ borderRadius: 2, lineHeight: 1 }}
            onClick={handleUserDialogClose}
          >
            Cancel
          </Button>

          <Button
            variant="outlined"
            sx={{ borderRadius: 2, margin: "0 10px"  }}
            onClick={() => handleClear()}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 2, lineHeight: 1 }}
            onClick={() => addBtnClickHandler()}
            disabled={lang && videoLink ? false : true}
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchSupportedLanguagesAPI from "../redux/actions/api/Project/FetchSupportedLanguages";
import APITransport from "../redux/actions/apitransport/apitransport";
import Loader from "./Spinner";
import { MenuProps } from "../utils/utils";
import { Box } from "@mui/system";

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
}) => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));
  }, []);

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4">Create New Video/Audio</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <FormControl fullWidth>
          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={isAudio}
            onChange={(event) => setIsAudio(event.target.value)}
          >
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Import Video"
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Import Audio"
            />
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
          label={
            isAudio === "true"
              ? "Enter Link from Google Drive Here"
              : "Enter Link from Youtube Here"
          }
          fullWidth
          multiline
          rows={4}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mt: 3 }}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={videoDescription}
          onChange={(event) => setVideoDescription(event.target.value)}
          sx={{ mb: 3, mt: 3 }}
        />
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px 24px 24px",
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            *Supported Formats: {isAudio === "false" ? "Youtube Link" : "mp3"}
          </Typography>
        </Box>
        <Box>
          <Button onClick={handleUserDialogClose}>Close</Button>
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

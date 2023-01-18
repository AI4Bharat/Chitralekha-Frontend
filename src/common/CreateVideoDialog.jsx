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
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchSupportedLanguagesAPI from "../redux/actions/api/Project/FetchSupportedLanguages";
import APITransport from "../redux/actions/apitransport/apitransport";
import Loader from "./Spinner";
import { MenuProps } from "../utils/utils";

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
          label={"Enter Link from Youtube or Google Drive Here"}
          fullWidth
          multiline
          rows={4}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mt: 3, mb: 3 }}
        />
      </DialogContent>
      <DialogActions style={{ padding: "0 24px 24px 0" }}>
        <Button autoFocus onClick={handleUserDialogClose}>
          Close
        </Button>
        <Button
          autoFocus
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => addBtnClickHandler()}
          disabled={!videoLink}
        >
          Create {apiStatus.progress && <Loader size={20} margin="0 0 0 5px" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVideoDialog;

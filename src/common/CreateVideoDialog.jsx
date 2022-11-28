import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React from "react";

const CreateVideoDialog = ({
  open,
  handleUserDialogClose,
  addBtnClickHandler,
  videoLink,
  setVideoLink,
  isAudio,
  setIsAudio,
}) => {
  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
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
              label="Upload Video"
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Upload Audio"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          label={"Enter Video Link from Youtube or Google Drive Here"}
          fullWidth
          multiline
          rows={4}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mt  : 3, mb: 3 }}
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
          Create 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVideoDialog;

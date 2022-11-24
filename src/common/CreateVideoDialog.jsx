import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
  const menuItems = [
    {
      label: "True",
      value: true,
    },
    {
      label: "False",
      value: false,
    },
  ];

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleUserDialogClose}
      close
      maxWidth={"md"}
    >
      <DialogTitle variant="h4">Create New Video</DialogTitle>
      <DialogContent style={{ paddingTop: 4 }}>
        <TextField
          label={"Enter Video Link from Youtube or Google Drive Here"}
          fullWidth
          multiline
          rows={4}
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth>
          <InputLabel id="type-select-label">Is Audio</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={isAudio}
            label="Is Audio"
            onChange={(event) => setIsAudio(event.target.value)}
          >
            {menuItems.map((item) => {
              return <MenuItem value={item.value}>{item.label}</MenuItem>;
            })}
          </Select>
        </FormControl>
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
        >
          Create Video
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVideoDialog;

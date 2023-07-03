import React from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UploadFormatDialog = ({
  open,
  handleClose,
  uploadExportType,
  setUploadExportType,
  handleSubtitleUpload,
}) => {
  const uploadOptions = [
    {
      value: "srt",
      label: "srt",
    },
    {
      value: "ytt",
      label: "ytt",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Upload Subtitles</Typography>{" "}
        <IconButton onClick={handleClose} sx={{ marginLeft: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
          Select Upload Format
        </DialogContentText>

        <DialogActions>
          <FormControl sx={{ mr: "auto" }}>
            <RadioGroup
              row
              value={uploadExportType}
              onChange={(event) => setUploadExportType(event.target.value)}
            >
              {uploadOptions?.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogActions>

        <DialogActions>
          <Button
            variant="standard"
            onClick={handleClose}
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubtitleUpload}
            style={{ borderRadius: "8px" }}
            autoFocus
          >
            Upload
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFormatDialog;

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
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const ExportDialog = ({
  open,
  handleClose,
  taskType,
  handleTranscriptRadioButton,
  handleTranslationRadioButton,
  handleTranscriptExport,
  handleTranslationExport,
  exportTranscription,
  exportTranslation,
  transcriptionOptions,
  translationOptions,
  isBulkTaskDownload,
  handleBulkTaskDownload,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Export Subtitles</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
          Select Export Type
        </DialogContentText>
        {taskType.includes("TRANSCRIPTION") ? (
          <DialogActions sx={{ mr: 10, mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                {transcriptionOptions?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    checked={exportTranscription === item}
                    label={item}
                    onClick={handleTranscriptRadioButton}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogActions>
        ) : (
          <DialogActions sx={{ mr: 17, mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                {translationOptions?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    checked={exportTranslation === item}
                    label={item}
                    onClick={handleTranslationRadioButton}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogActions>
        )}
        <DialogActions>
          <Button
            variant="standard"
            onClick={handleClose}
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>

          {isBulkTaskDownload ? (
            <Button
              variant="contained"
              onClick={handleBulkTaskDownload}
              style={{ borderRadius: "8px" }}
              autoFocus
            >
              Export
            </Button>
          ) : taskType.includes("TRANSCRIPTION") ? (
            <Button
              variant="contained"
              onClick={handleTranscriptExport}
              style={{ borderRadius: "8px" }}
              autoFocus
            >
              Export
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleTranslationExport}
              style={{ borderRadius: "8px" }}
              autoFocus
            >
              Export
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;

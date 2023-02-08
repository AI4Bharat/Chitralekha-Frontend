import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import CustomButton from "./Button";

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
      <DialogTitle variant="h4">Export Subtitle</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
          Select Export Type
        </DialogContentText>
        {taskType === "TRANSCRIPTION_EDIT" ||
        taskType === "TRANSCRIPTION_REVIEW" ? (
          <DialogActions sx={{ mr: 10, mb: 1, mt: 1 }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                {transcriptionOptions?.map((item, index) => (
                  <FormControlLabel
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
          <CustomButton
            buttonVariant="standard"
            onClick={handleClose}
            label="Cancel"
          />
          {isBulkTaskDownload ? (
            <CustomButton
              buttonVariant="contained"
              onClick={handleBulkTaskDownload}
              label="Export"
              style={{ borderRadius: "8px" }}
              autoFocus
            />
          ) : taskType === "TRANSCRIPTION_EDIT" ||
            taskType === "TRANSCRIPTION_REVIEW" ? (
            <CustomButton
              buttonVariant="contained"
              onClick={handleTranscriptExport}
              label="Export"
              style={{ borderRadius: "8px" }}
              autoFocus
            />
          ) : (
            <CustomButton
              onClick={handleTranslationExport}
              label="Export"
              buttonVariant="contained"
              style={{ borderRadius: "8px" }}
              autoFocus
            />
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;

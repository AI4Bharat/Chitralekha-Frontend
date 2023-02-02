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

const ExportAllDialog = ({
  open,
  handleClose,
  exportOptions,
  exportType,
  handleExportRadioButton,
  handleExport,
  loading
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4">Export Subtitles</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
          Select Export Format
        </DialogContentText>

        <DialogActions sx={{ mr: 10, mb: 1, mt: 1 }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              {exportOptions?.map((item, index) => (
                <FormControlLabel
                  value={item}
                  control={<Radio />}
                  checked={exportType === item}
                  label={item}
                  onClick={(e) => handleExportRadioButton(e.target.value)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogActions>

        <DialogActions>
          <CustomButton
            buttonVariant="standard"
            onClick={handleClose}
            label="Cancel"
          />

          <CustomButton
            onClick={handleExport}
            label="Export"
            buttonVariant="contained"
            style={{ borderRadius: "8px" }}
            autoFocus
          />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ExportAllDialog;

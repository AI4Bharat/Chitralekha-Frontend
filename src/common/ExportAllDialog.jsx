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

const ExportAllDialog = ({
  open,
  handleClose,
  exportOptions,
  exportType,
  handleExportRadioButton,
  handleExport,
  loading,
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
                  key={index}
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
          <Button
            variant="standard"
            onClick={handleClose}
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>

          <Button
            autoFocus
            variant="contained"
            onClick={handleExport}
            style={{ borderRadius: "8px" }}
          >
            Export
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ExportAllDialog;

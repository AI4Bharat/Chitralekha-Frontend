import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const NotesDialog = ({ open, handleClose, text, handleSubmit, setText }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Notes</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          label="Notes"
          value={text}
          sx={{ margin: "15px 0" }}
          onChange={(event) => setText(event.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ p: "20px", pt: 0 }}>
        <Button
          variant="text"
          onClick={() => setText("")}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Clear
        </Button>

        <Button
          autoFocus
          variant="contained"
          sx={{ lineHeight: "1", marginLeft: "10px", borderRadius: "8px" }}
          onClick={handleSubmit}
        >
          Submit{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;

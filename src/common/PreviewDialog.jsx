import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  DialogTitle,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PreviewDialog = ({ openPreviewDialog, handleClose, data, taskType }) => {
  return (
    <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4">Subtitles</Typography>{" "}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ height: "410px" }}>
        <DialogContentText id="alert-dialog-description">
          {data?.map((el, i) => {
            return (
              <Box
                key={i}
                id={`sub_${i}`}
                textAlign={"start"}
                sx={{
                  mb: 2,
                  padding: 2,
                  border: "1px solid #000000",
                  borderRadius: 2,
                  width: "90%",
                }}
              >
                {taskType.includes("TRANSCRIPTION") ? el.text : el.target_text}
              </Box>
            );
          })}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;

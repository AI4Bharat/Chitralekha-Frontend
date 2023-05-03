import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const PreviewDialog = ({ openPreviewDialog, handleClose, data, task_type }) => {
  const [Previewdata, setPreviewdata] = useState();

  useEffect(() => {
    setPreviewdata(data);
  }, [data]);
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
          {Previewdata?.data?.payload &&
          Previewdata?.data?.payload.length > 0 ? (
            Previewdata?.data?.payload.map((el, i) => {
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
                  {task_type === "TRANSCRIPTION_EDIT" ||
                  task_type === "TRANSCRIPTION_REVIEW"
                    ? el.text
                    : el.target_text}
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                // marginY: 2,
                padding: 3,
                border: "1px solid #000000",
                borderRadius: 2,
                width: "80%",
              }}
            ></Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "20px" }}>
        {/* <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Close
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;

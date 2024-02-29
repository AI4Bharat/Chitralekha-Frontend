import {
  Dialog,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FetchpreviewTaskAPI, setSnackBar } from "redux/actions";
import { useDispatch } from "react-redux";

const PreviewDialog = ({
  openPreviewDialog,
  handleClose,
  videoId,
  taskType,
  targetLanguage,
}) => {
  const dispatch = useDispatch();

  const [previewdata, setPreviewdata] = useState([]);

  const fetchPreviewData = useCallback(async () => {
    const taskObj = new FetchpreviewTaskAPI(videoId, taskType, targetLanguage);
    try {
      const res = await fetch(taskObj.apiEndPoint(), {
        method: "GET",
        headers: taskObj.getHeaders().headers,
      });

      const response = await res.json();
      setPreviewdata(response.data.payload);
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }
  }, [dispatch, videoId, taskType, targetLanguage]);

  useEffect(() => {
    fetchPreviewData();
  }, [fetchPreviewData]);

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
          {previewdata.map((el, i) => {
            return (
              <Box
                key={`sub-${i}`}
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

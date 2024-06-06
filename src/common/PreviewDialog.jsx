import {
  Dialog,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useCallback, useEffect, useState,useRef} from "react";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { FetchpreviewTaskAPI, setSnackBar } from "redux/actions";
import { useDispatch } from "react-redux";
import Loader from "./Spinner";
import TimeBoxes from "./TimeBoxes";

const PreviewDialog = ({
  openPreviewDialog,
  handleClose,
  videoId,
  taskType,
  currentSubs,
  targetLanguage,
}) => {
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [previewdata, setPreviewdata] = useState([]);
  const [selectedSubtitleIndex,setSelectedSubtitleIndex] = useState();
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);

  const fetchPreviewData = useCallback(async () => {
    setLoading(true)
    const taskObj = new FetchpreviewTaskAPI(videoId, taskType, targetLanguage);
    try {
      const res = await fetch(taskObj.apiEndPoint(), {
        method: "GET",
        headers: taskObj.getHeaders().headers,
      });

      const response = await res.json();
        setPreviewdata(response.data.payload);
        setLoading(false)
    } catch (error) {
      setLoading(false)
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }
  }, [ dispatch,videoId, taskType, targetLanguage]);

  useEffect(() => {
    if (openPreviewDialog) {
      fetchPreviewData();
    }
  }, [fetchPreviewData, openPreviewDialog]);

 
  useEffect(() => {
    if (
      openPreviewDialog &&
      selectedSubtitleIndex !== null &&
      !loading
    ) {
      // setTimeout(() => {
        const subtitleId = `sub-${selectedSubtitleIndex}`;
        const subtitleElement = document.getElementById(subtitleId);
        if (subtitleElement) {
          subtitleElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      // }, 5000); 
    }
  }, [openPreviewDialog, selectedSubtitleIndex,loading]);

  useEffect(() => {
    if (currentSubs) {
      const selectedIndex = previewdata.findIndex((el) => 
        el.text === currentSubs.text && el.target_text === currentSubs.target_text
      );
      setSelectedSubtitleIndex(selectedIndex);
    }
  }, [currentSubs, previewdata,loading,isFullscreen]);

  const handleFullscreenToggle = () => {
    const elem = dialogRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

 

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      ref={dialogRef}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ 
        style: { 
          borderRadius: "10px", 
          width: isFullscreen ? '100%' : 'auto',
          height: isFullscreen ? '100%' : 'auto',
          margin: 0,
          maxWidth: isFullscreen ? '100%' : '600px',
        } 
      }}
      fullScreen={isFullscreen}

    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4" flexGrow={1}>Subtitles</Typography>{" "}
        <IconButton
          aria-label="fullscreen"
          onClick={handleFullscreenToggle}
          sx={{ marginLeft: "auto" }}
        >
         {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent  sx={{ height: "410px", zIndex:"4" }}>
        {loading ? (
           <div style={{
            position: 'absolute',
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 1, 
          }}>
            <CircularProgress />
            </div>
        ) : (

        <DialogContentText id="alert-dialog-description">
          {previewdata.map((el, i) => {
            const isCurrentSub =
              el.text === currentSubs?.text &&
              el.target_text === currentSubs?.target_text;

            return (
              <Box key={`sub-${i}`}  display="flex" alignItems="center" 
              >
              <Box key={`sub-${i}`} display="flex" flexDirection="column" alignItems="center"
              sx={{
                border: "1px solid #000000",
                  borderRadius: 2,
                  cursor: "pointer",
                  padding: 2,
                  mr:2

              }}>
              <TimeBoxes time={el.start_time} type={"startTime"} /> {/* Display start time */}
              <TimeBoxes time={el.end_time} type={"endTime"} /> {/* Display end time */}
              </Box>
              <Box
                textAlign={"start"}
                sx={{
                  mb: 2,
                  padding: 2,
                  border: "1px solid #000000",
                  borderRadius: 2,
                  width: "90%",
                  cursor: "pointer",
                  backgroundColor: isCurrentSub ? "#e0e0e0" : "transparent",
                  maxHeight:"50px",
                  overflow:"auto"
                }}
              >
                {taskType.includes("TRANSCRIPTION")
                  ? el.text
                  : el.target_text}
              </Box>
            </Box>
          );
        })}
    </DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
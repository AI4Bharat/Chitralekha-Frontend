import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FetchVideoDetailsAPI from "../redux/actions/api/Project/FetchVideoDetails";
import APITransport from "../redux/actions/apitransport/apitransport";

const VideoDialog = ({ open, handleClose, videoDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoDetails.url,
      videoDetails.language,
      videoDetails.project_id,
      videoDetails.audio_only
    );
    dispatch(APITransport(apiObj));
  }, []);

  const video = useSelector((state) => state.getVideoDetails.data);

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={"xl"}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <Typography variant="h4" style={{ marginRight: "auto" }}>
          {videoDetails.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <video controls src={video.direct_video_url} />
      </DialogContent>
      <DialogActions style={{ padding: "24px" }}>
        <Typography variant="body1" style={{ marginRight: "auto" }}>
          Duration: {videoDetails.duration}
        </Typography>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoDialog;

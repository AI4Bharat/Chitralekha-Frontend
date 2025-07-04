import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VideoScreenshotDialog = ({ open, onClose, videoUrl, onCapture, initialTimestamp }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVideoLoading, setVideoLoading] = useState(true);

  const handleVideoLoaded = () => {
    setVideoLoading(false);

    if (videoRef.current && typeof initialTimestamp === 'number') {
      videoRef.current.currentTime = initialTimestamp;
    }
  };

  const handleCaptureScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    onCapture(imageDataUrl);
    onClose();
  };
  
  const deleteCapturedScreenshot = () => {
    onCapture(null);
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      setVideoLoading(true);
    }
  }, [open, videoUrl]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Capture Screenshot
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Box sx={{ position: 'relative', minHeight: '200px' }}>
          {isVideoLoading && (
            <Box>
              <CircularProgress color="inherit" sx={{ color: 'white' }} />
            </Box>
          )}
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            width="100%"
            onLoadedData={handleVideoLoaded}
            key={`${videoUrl}-${initialTimestamp}`}
            style={{ display: isVideoLoading ? 'none' : 'block' }}
            crossOrigin="anonymous"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={deleteCapturedScreenshot}
          variant="contained"
          color="error"
          disabled={isVideoLoading}
        >
          Delete
        </Button>
        <Button
          onClick={handleCaptureScreenshot}
          variant="contained"
          disabled={isVideoLoading}
        >
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoScreenshotDialog;
import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { createRef, memo, useCallback, useEffect } from "react";
import ProjectStyle from "../../../styles/ProjectStyle";

const VideoPanel = memo(
  ({ setPlayer, setCurrentTime, setPlaying }) => {
    const classes = ProjectStyle();
    const $video = createRef();

    const isPlaying = ($video) => {
      return !!(
        $video.currentTime > 0 &&
        !$video.paused &&
        !$video.ended &&
        $video.readyState > 2
      );
    };

    useEffect(() => {
      setPlayer($video.current);
      (function loop() {
        window.requestAnimationFrame(() => {
          if ($video.current) {
            setPlaying(isPlaying($video.current));
            setCurrentTime($video.current.currentTime || 0);
          }
          loop();
        });
      })();
    }, [setPlayer, setCurrentTime, setPlaying, $video]);

    const onClick = useCallback(() => {
      if ($video.current) {
        if (isPlaying($video.current)) {
          $video.current.pause();
        } else {
          $video.current.play();
        }
      }
    }, [$video]);

    return (
      <Box margin="auto">
        <Typography variant="h4" textAlign="center" marginBottom="15px">Video Name</Typography>
        <video
          onClick={onClick}
          src={
            "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
          }
          ref={$video}
          className={classes.videoPlayer}
        />
      </Box>
    );
  },
  () => true
);

export default VideoPanel;
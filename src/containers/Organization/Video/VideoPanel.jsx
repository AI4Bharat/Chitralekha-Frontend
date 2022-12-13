import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { createRef, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const VideoPanel = memo(
  ({ setPlayer, setCurrentTime, setPlaying }) => {
    const $video = createRef();
    const videoDetails = useSelector((state) => state.getVideoDetails.data);

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
      <Box margin="auto" display="flex" flexDirection="column">
        <Typography variant="h4" textAlign="center" paddingY={4}>
          {videoDetails?.video?.name}
        </Typography>

        <video
          onClick={onClick}
          src={videoDetails?.direct_video_url}
          ref={$video}
          // className={classes.videoPlayer}
        />
      </Box>
    );
  },
  () => true
);

export default VideoPanel;

import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectStyle from "../../../styles/ProjectStyle";

const VideoPanel = memo(
  ({ setPlayer, setCurrentTime, setPlaying }) => {
    const dispatch = useDispatch();
    const classes = ProjectStyle();
    const $video = createRef();
    const videoDetails = useSelector((state) => state.getVideoDetails.data);
    const fullscreenVideo = useSelector(
      (state) => state.commonReducer.fullscreenVideo
    );

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
      <Box
        margin="auto"
        display="flex"
        flexDirection="column"
        style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          paddingY={4}
          style={fullscreenVideo ? { color: "white" } : {}}
        >
          {videoDetails?.video?.name}
        </Typography>

        <video
          onClick={onClick}
          src={
            videoDetails?.video?.audio_only
              ? videoDetails?.direct_audio_url
              : videoDetails?.direct_video_url
          }
          style={{
            cursor: "pointer",
            width: videoDetails?.video?.audio_only ? "20%" : "",
            width: videoDetails?.video?.audio_only ? "20%" : "",
            margin: videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : ""
          }}
          poster={videoDetails?.video?.audio_only && "playpause.png"}
          ref={$video}
          // className={classes.videoPlayer}
        />
      </Box>
    );
  },
  () => true
);

export default VideoPanel;

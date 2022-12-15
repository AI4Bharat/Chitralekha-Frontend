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
import C from "../../../redux/constants";
import ProjectStyle from "../../../styles/ProjectStyle";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { FullScreenVideo } from "../../../redux/actions/Common";

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

    const handleFullscreenVideo = () => {
      let doc = window.document;
      let elem = document.getElementById("video");

      const requestFullScreen =
        elem.requestFullscreen ||
        elem.mozRequestFullScreen ||
        elem.webkitRequestFullScreen ||
        elem.msRequestFullscreen;
      const cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(elem);
        dispatch(FullScreenVideo(true, C.FULLSCREEN_VIDEO));
      } else {
        dispatch(FullScreenVideo(false, C.FULLSCREEN_VIDEO));
        cancelFullScreen.call(doc);
      }
    };

    return (
      <Box margin="auto" display="flex" flexDirection="column" id="video">
        <Typography variant="h4" textAlign="center" paddingY={4}>
          {videoDetails?.video?.name}
        </Typography>

        <video
          onClick={onClick}
          src={videoDetails?.direct_video_url}
          ref={$video}
          // className={classes.videoPlayer}
        />

        {/* <Box>
          {fullscreenVideo ? (
            <Button
              className={classes.fullscreenVideoBtn}
              aria-label="fullscreen"
              onClick={() => handleFullscreenVideo()}
              variant="outlined"
            >
              <FullscreenExitIcon />
            </Button>
          ) : (
            <Button
              className={classes.fullscreenVideoBtn}
              aria-label="fullscreenExit"
              onClick={() => handleFullscreenVideo()}
              variant="outlined"
            >
              <FullscreenIcon />
            </Button>
          )}
        </Box> */}
      </Box>
    );
  },
  () => true
);

export default VideoPanel;

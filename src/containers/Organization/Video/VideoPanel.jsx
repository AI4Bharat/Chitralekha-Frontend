import { IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectStyle from "../../../styles/ProjectStyle";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CustomMenuComponent from "../../../common/CustomMenuComponent";

const VideoPanel = memo(
  ({
    setPlayer,
    setCurrentTime,
    setPlaying,
    fontMenu,
    setFontSize,
    fontSize,
    darkAndLightMode,
    setDarkAndLightMode,
  }) => {
    const dispatch = useDispatch();
    const classes = ProjectStyle();
    const $video = createRef();

    const [currentPlayer, setCurrentPlayer] = useState();

    const videoDetails = useSelector((state) => state.getVideoDetails.data);
    const fullscreenVideo = useSelector(
      (state) => state.commonReducer.fullscreenVideo
    );

    const [anchorElSettings, setAnchorElSettings] = useState(null);

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
      setCurrentPlayer($video.current);
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

    const handleCloseSettingsMenu = () => {
      setAnchorElSettings(null);
    };

    return (
      <Box
        margin="auto"
        display="flex"
        flexDirection="column"
        style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
      >
        <Box display="flex" flexDirection="row">
          <Typography
            variant="h4"
            textAlign="center"
            paddingY={4}
            width="90%"
            style={fullscreenVideo ? { color: "white" } : {}}
          >
            {videoDetails?.video?.name}
          </Typography>

          <Tooltip title="Settings" placement="bottom">
            <IconButton
              sx={{
                backgroundColor: "#2C2799",
                borderRadius: "50%",
                color: "#fff",
                margin: "auto",
                "&:hover": {
                  backgroundColor: "#271e4f",
                },
              }}
              onClick={(event) => setAnchorElSettings(event.currentTarget)}
            >
              <ArrowDropDownCircleIcon />
            </IconButton>
          </Tooltip>

          {currentPlayer && (
            <CustomMenuComponent
              anchorElSettings={anchorElSettings}
              handleClose={handleCloseSettingsMenu}
              fontMenu={fontMenu}
              setFontSize={setFontSize}
              fontSize={fontSize}
              darkAndLightMode={darkAndLightMode}
              setDarkAndLightMode={setDarkAndLightMode}
              player={currentPlayer}
            />
          )}
        </Box>

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
            margin:
              videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
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

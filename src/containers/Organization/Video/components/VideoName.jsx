import { IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CustomMenuComponent from "../../../../common/CustomMenuComponent";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";
import { memo } from "react";
import { useSelector } from "react-redux";

const VideoName = ({
  fontSize,
  setFontSize,
  darkAndLightMode,
  setDarkAndLightMode,
  player,
}) => {
  const classes = VideoLandingStyle();

  const [anchorElSettings, setAnchorElSettings] = useState(null);

  const fullscreenVideo = useSelector(
    (state) => state.commonReducer.fullscreenVideo
  );
  const videoDetails = useSelector((state) => state.getVideoDetails.data);

  return (
    <Box
      className={classes.videoNameBox}
      style={fullscreenVideo ? { width: "60%", margin: "auto" } : {}}
    >
      <Tooltip title={videoDetails?.video?.name} placement="bottom">
        <Typography
          variant="h4"
          className={classes.videoName}
          style={fullscreenVideo ? { color: "white" } : {}}
        >
          {videoDetails?.video?.name}
        </Typography>
      </Tooltip>

      <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.settingsIconBtn}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <WidgetsOutlinedIcon />
        </IconButton>
      </Tooltip>

      <CustomMenuComponent
        anchorElSettings={anchorElSettings}
        handleClose={() => setAnchorElSettings(null)}
        setFontSize={setFontSize}
        fontSize={fontSize}
        darkAndLightMode={darkAndLightMode}
        setDarkAndLightMode={setDarkAndLightMode}
        player={player}
        contianer={document.getElementById("video")}
      />
    </Box>
  );
};

export default memo(VideoName);

import React, { memo, useState } from "react";
import { useSelector } from "react-redux";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { CustomMenuComponent } from "common";

const VideoName = ({
  fontSize,
  setFontSize,
  darkAndLightMode,
  setDarkAndLightMode,
  subtitlePlacement,
  setSubtitlePlacement,
  showSubtitles,
  setShowSubtitles,
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
      style={fullscreenVideo ? { width: "60%", margin: "auto" } : { border:"solid", borderColor: "#F5F5F5", borderWidth: "1px"}}
    >
      <Tooltip title={videoDetails?.video?.name} placement="bottom">
        <Typography
          variant="h6"
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
          <WidgetsOutlinedIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <CustomMenuComponent
        anchorElSettings={anchorElSettings}
        handleClose={() => setAnchorElSettings(null)}
        setFontSize={setFontSize}
        fontSize={fontSize}
        darkAndLightMode={darkAndLightMode}
        setDarkAndLightMode={setDarkAndLightMode}
        contianer={document.getElementById("video")}
        subtitlePlacement={subtitlePlacement}
        setSubtitlePlacement={setSubtitlePlacement}
        showSubtitles={showSubtitles}
        setShowSubtitles={setShowSubtitles}
      />
    </Box>
  );
};

export default memo(VideoName);

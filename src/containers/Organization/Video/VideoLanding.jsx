import { Box } from "@mui/material";
import React from "react";
import RightPanel from "../../../common/RightPanel";
import Timeline from "../../../common/Timeline";
import VideoPanel from "../../../common/VideoPanel";

const VideoLanding = () => {
  return (
    <Box display={"flex"} flexDirection="column" sx={{ mt: 7, height: "100%" }}>
      <Box display={"flex"} height="calc(100% - 350px)">
        <RightPanel />
        <VideoPanel />
      </Box>
      <Box>
        <Timeline />
      </Box>
    </Box>
  );
};

export default VideoLanding;

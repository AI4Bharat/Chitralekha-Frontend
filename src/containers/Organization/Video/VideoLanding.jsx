import { Box } from "@mui/material";
import React, { useState } from "react";
import RightPanel from "./RightPanel";
import Timeline from "./Timeline";
import VideoPanel from "./VideoPanel";

const VideoLanding = () => {
  const [waveform, setWaveform] = useState();
  const [player, setPlayer] = useState();
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <Box sx={{ mt: 7 }} height={"calc(100% - 56px)"}>
      <Box display={"flex"} height="calc(100% - 150px)">
        <VideoPanel
          setPlayer={setPlayer}
          setCurrentTime={setCurrentTime}
          setPlaying={setPlaying}
        />
        <RightPanel />
      </Box>
      <Box height={"150px"} position="relative">
        <Timeline
          waveform={waveform}
          setWaveform={setWaveform}
          player={player}
          render={render}
          setRender={setRender}
          currentTime={currentTime}
          playing={playing}
        />
      </Box>
    </Box>
  );
};

export default VideoLanding;

import { Box } from "@mui/system";
import React, { createRef } from "react";

const VideoPanel = () => {
  const $video = createRef();

  const isPlaying = ($video) => {
    return !!(
      $video.currentTime > 0 &&
      !$video.paused &&
      !$video.ended &&
      $video.readyState > 2
    );
  };

  const onClick = () => {
    if ($video.current) {
      if (isPlaying($video.current)) {
        $video.current.pause();
      } else {
        $video.current.play();
      }
    }
  };

  return (
    <Box width="70%" margin="auto">
      <video
        onClick={onClick}
        src={
          "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
        }
        ref={$video}
      />
    </Box>
  );
};

export default VideoPanel;

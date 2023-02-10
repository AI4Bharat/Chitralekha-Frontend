import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";

const VideoPanel = memo(
  ({
    setPlayer,
    setCurrentTime,
    setPlaying,
  }) => {
    const classes = VideoLandingStyle();
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
    );
  },
  () => true
);

export default VideoPanel;

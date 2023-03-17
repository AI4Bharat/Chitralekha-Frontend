import React, { createRef, memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlayer } from "../../../../redux/actions/Common";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";

const VideoPanel = memo(
  ({ setCurrentTime, setPlaying }) => {
    const classes = VideoLandingStyle();
    const dispatch = useDispatch();
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
      dispatch(setPlayer($video.current));
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
      <div className={classes.videoPlayerParent}>
        <video
          onClick={onClick}
          src={
            videoDetails?.video?.audio_only
              ? videoDetails?.direct_audio_url
              : videoDetails?.direct_video_url
          }
          style={{
            width: videoDetails?.video?.audio_only ? "20%" : "",
            width: videoDetails?.video?.audio_only ? "20%" : "",
            margin:
              videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
          }}
          poster={videoDetails?.video?.audio_only && "playpause.png"}
          ref={$video}
          className={classes.videoPlayer}
        />
      </div>
    );
  },
  () => true
);

export default VideoPanel;

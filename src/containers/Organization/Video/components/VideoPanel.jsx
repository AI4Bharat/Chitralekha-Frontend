import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { isPlaying } from "utils/subtitleUtils";

//Styles
import { VideoLandingStyle } from "styles";

//APIs
import { setPlayer } from "redux/actions";

const VideoPanel = memo(
  ({ setCurrentTime, setPlaying }) => {
    const classes = VideoLandingStyle();
    const dispatch = useDispatch();
    const $video = createRef();

    const [poster, setPoster] = useState("play.png");

    const videoDetails = useSelector((state) => state.getVideoDetails.data);
    const fullscreenVideo = useSelector(
      (state) => state.commonReducer.fullscreenVideo
    );

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
      // eslint-disable-next-line
    }, [setPlayer, setCurrentTime, setPlaying, $video]);

    const onClick = useCallback(() => {
      if ($video.current) {
        if (isPlaying($video.current)) {
          $video.current.pause();
          setPoster("play.png");
        } else {
          $video.current.play();
          setPoster("pause.png");
        }
      }
    }, [$video]);

    return (
      <div className={classes.videoPlayerParent} style={{ display: "flex" }}>
        <video
          onClick={onClick}
          src={
            videoDetails?.video?.audio_only
              ? videoDetails?.direct_audio_url
              : videoDetails?.direct_video_url
          }
          style={{
            width: videoDetails?.video?.audio_only ? "20%" : "",
            margin:
              videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
          }}
          poster={videoDetails?.video?.audio_only ? poster : ""}
          ref={$video}
          className={classes.videoPlayer}
        />
      </div>
    );
  },
  () => true
);

export default VideoPanel;

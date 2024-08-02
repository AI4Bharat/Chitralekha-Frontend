import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { isPlaying } from "utils/subtitleUtils";
import ReactPlayerYT from "react-player/youtube";
import ReactPlayer from "react-player";
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
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const fullscreenVideo = useSelector(
      (state) => state.commonReducer.fullscreenVideo
    );
  const player = useSelector((state) => state.commonReducer.player);

    useEffect(() => {
      // dispatch(setPlayer($video.current.getInternalPlayer()));
      (function loop() {
        window.requestAnimationFrame(() => {
          if (player) {
            if (typeof player?.getPlayerState === "function"){
              setPlaying(player?.getPlayerState() === 1 ? true : false);
            }else{
              setPlaying(isPlaying(player));
            }
            setCurrentTime(typeof player?.getCurrentTime === 'function' ? player?.getCurrentTime() : player.currentTime || 0);
          }
          loop();
        });
      })();
      // eslint-disable-next-line
    }, [player, setCurrentTime, setPlaying]);

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
      <div className={classes.videoPlayerParent} style={{display: "flex", alignItems: "center", justifyContent: "center", height:"100%"}}>
        { videoDetails.length === 0 && taskData?.video_url?.includes("youtube") ?
        <ReactPlayerYT
          onReady={() => {dispatch(setPlayer($video.current.getInternalPlayer()))}}
          ref={$video}
          url={taskData.video_url.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/")}
          controls={true}
        />
        :
        <ReactPlayer
          // onClick={onClick}
          url={
            videoDetails?.video?.audio_only
              ? videoDetails?.direct_audio_url
              : videoDetails?.direct_video_url
          }
          style={{
            width: videoDetails?.video?.audio_only ? "20%" : "",
            margin:
              videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
            marginTop:"auto",
            marginBottom:"auto",
          }}
          poster={videoDetails?.video?.audio_only ? poster : ""}
          ref={$video}
          className={classes.videoPlayer}
          controls={true}
          controlsList="nodownload"
          onReady={() => {dispatch(setPlayer($video.current.getInternalPlayer()))}}
        />
      }
      </div>
    );
  },
  () => true
);

export default VideoPanel;

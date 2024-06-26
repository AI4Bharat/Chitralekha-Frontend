import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import clamp from "lodash/clamp";
import DT from "duration-time-conversion";
import { throttle } from "lodash";
import { useSelector } from "react-redux";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import { Box } from "@mui/material";
import WFPlayer from "wfplayer";
import Metronome from "./components/Metronome";
import SubtitleBoxes from "./components/SubtitleBoxes";

const WaveForm = memo(({ setWaveform, setRender }) => {
  const classes = VideoLandingStyle();
  const $waveform = useRef();

  const player = useSelector((state) => state.commonReducer.player);

  useEffect(() => {
    [...WFPlayer.instances].forEach((item) => item.destroy());

    const waveform = new WFPlayer({
      scrollable: true,
      useWorker: false,
      duration: 10,
      padding: 1,
      wave: true,
      pixelRatio: 2,
      container: $waveform.current,
      mediaElement: player,
      backgroundColor: "#fff",
      waveColor: "#000",
      progressColor: "#00a",
      gridColor: "rgba(0, 0, 0, 0.05)",
      rulerColor: "rgba(0, 0, 0, 0.5)",
      paddingColor: "rgba(0, 0, 0, 0)",
    });

    setWaveform(waveform);
    waveform.on("update", setRender);

    if (player.src !== "") {
      waveform.load(encodeURIComponent(player.src.replace(/&amp;/g, "&")));
    }
  }, [player, $waveform, setWaveform, setRender, player.src]);

  return <div className={classes.waveform} ref={$waveform} />;
});

const Progress = memo(({ waveform, currentTime, subtitle = [] }) => {
  const classes = VideoLandingStyle();

  const player = useSelector((state) => state.commonReducer.player);

  const [grabbing, setGrabbing] = useState(false);

  const onProgressClick = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const currentTime =
        (event.pageX / document.body.clientWidth) * player.duration;
      player.currentTime = currentTime;
      waveform.seek(currentTime);
    },

    // eslint-disable-next-line
    [player, waveform]
  );

  const onGrabDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      setGrabbing(true);
    },
    [setGrabbing]
  );

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing) {
        const currentTime =
          (event.pageX / document.body.clientWidth) * player.duration;
        player.currentTime = currentTime;
      }
    },
    [grabbing, player]
  );

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(false);
      waveform.seek(player.currentTime);
    }
  }, [grabbing, waveform, player.currentTime]);

  useEffect(() => {
    document.addEventListener("mouseup", onDocumentMouseUp);
    document.addEventListener("mousemove", onGrabMove);
    return () => {
      document.removeEventListener("mouseup", onDocumentMouseUp);
      document.removeEventListener("mousemove", onGrabMove);
    };
  }, [onDocumentMouseUp, onGrabMove]);

  return (
    <Box className={classes.progress} onClick={onProgressClick}>
      <Box
        className={classes.bar}
        style={{
          width: `${(currentTime / player.duration) * 100}%`,
        }}
      >
        <Box className={classes.handle} onMouseDown={onGrabDown}></Box>
      </Box>
      <Box className={classes.timelineSubtitle}>
        {subtitle.length <= 200
          ? subtitle.map((item, index) => {
              const { duration } = player;
              return (
                <span
                  key={index}
                  className={classes.item}
                  style={{
                    left: `${(item.startTime / duration) * 100}%`,
                    width: `${(item.duration / duration) * 100}%`,
                  }}
                />
              );
            })
          : null}
      </Box>
    </Box>
  );
});

const Grab = memo(({ waveform }) => {
  const classes = VideoLandingStyle();

  const player = useSelector((state) => state.commonReducer.player);

  const [grabStartX, setGrabStartX] = useState(0);
  const [grabStartTime, setGrabStartTime] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const onGrabDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      setGrabStartX(event.pageX);
      setGrabStartTime(player.currentTime);
      setGrabbing(true);
    },
    [player]
  );

  const onGrabUp = () => {
    setGrabStartX(0);
    setGrabStartTime(0);
    setGrabbing(false);
  };

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing && player && waveform) {
        const currentTime = clamp(
          grabStartTime -
            ((event.pageX - grabStartX) / document.body.clientWidth) * 10,
          0,
          player.duration
        );
        player.currentTime = currentTime;
        waveform.seek(currentTime);
      }
    },
    [grabbing, player, waveform, grabStartX, grabStartTime]
  );

  useEffect(() => {
    document.addEventListener("mouseup", onGrabUp);
    return () => document.removeEventListener("mouseup", onGrabUp);
  }, []);

  return (
    <div
      className={`${classes.grab} ${grabbing ? classes.grabbing : ""}`}
      onMouseDown={onGrabDown}
      onMouseMove={onGrabMove}
    />
  );
});

const Duration = memo(({ currentTime }) => {
  const classes = VideoLandingStyle();
  const player = useSelector((state) => state.commonReducer.player);

  const getDuration = useCallback((time) => {
    time = time === Infinity ? 0 : time;
    return DT.d2t(time).split(".")[0];
  }, []);

  return (
    <div className={classes.duration}>
      {currentTime > 0 && (
        <span className={classes.durationSpan}>
          {getDuration(currentTime)} / {getDuration(player.duration || 0)}
        </span>
      )}
    </div>
  );
});

const Timeline = ({ currentTime, playing }) => {
  const $footer = useRef();
  const classes = VideoLandingStyle();

  const player = useSelector((state) => state.commonReducer.player);
  const videoDetails = useSelector((state) => state.getVideoDetails.data);

  const [waveform, setWaveform] = useState();
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });

  const onWheel = useCallback(
    (event) => {
      if (
        !player ||
        !waveform ||
        player.playing ||
        !$footer.current ||
        !$footer.current.contains(event.target)
      ) {
        return;
      }

      const deltaY = Math.sign(event.deltaY) / 5;
      const currentTime = clamp(
        player.currentTime + deltaY,
        0,
        player.duration
      );
      player.currentTime = currentTime;
      waveform.seek(currentTime);
    },
    [waveform, player, $footer]
  );

  useEffect(() => {
    const onWheelThrottle = throttle(onWheel, 100);
    window.addEventListener("wheel", onWheelThrottle);
    return () => window.removeEventListener("wheel", onWheelThrottle);
  }, [onWheel]);

  return (
    <Box className={classes.timeLineParent} ref={$footer}>
      {player &&
        (videoDetails.direct_video_url || videoDetails.direct_audio_url) && (
          <>
            <Progress waveform={waveform} currentTime={currentTime} />
            <Duration currentTime={currentTime} />
            <WaveForm setWaveform={setWaveform} setRender={setRender} />
            <Grab waveform={waveform} />
            <Metronome render={render} playing={playing} />
            <SubtitleBoxes
              render={render}
              playing={playing}
              currentTime={currentTime}
            />
          </>
        )}
    </Box>
  );
};

export default memo(Timeline);

import React, { useEffect, useCallback, useState } from "react";
import DT from "duration-time-conversion";
import isEqual from "lodash/isEqual";
import ProjectStyle from "../../../styles/ProjectStyle";
import { Box } from "@mui/material";

const findIndex = (subs, startTime) => {
  return subs.findIndex((item, index) => {
    return (
      (startTime >= item.endTime && !subs[index + 1]) ||
      (item.startTime <= startTime && item.endTime > startTime) ||
      (startTime >= item.endTime &&
        subs[index + 1] &&
        startTime < subs[index + 1].startTime)
    );
  });
};

export default React.memo(
  function Component({
    render,
    subtitles,
    subtitleEnglish,
    newSub,
    addSub,
    player,
    playing,
    configuration,
  }) {
    const classes = ProjectStyle();

    const [isDroging, setIsDroging] = useState(false);
    const [drogStartTime, setDrogStartTime] = useState(0);
    const [drogEndTime, setDrogEndTime] = useState(0);
    const gridGap = document.body.clientWidth / render.gridNum;

    const getEventTime = useCallback(
      (event) => {
        return (
          (event.pageX - render.padding * gridGap) / gridGap / 10 +
          render.beginTime
        );
      },
      [gridGap, render]
    );

    const onMouseDown = useCallback(
      (event) => {
        if (event.button !== 0) return;
        const clickTime = getEventTime(event);
        setIsDroging(true);
        setDrogStartTime(clickTime);
      },
      [getEventTime]
    );

    const onMouseMove = useCallback(
      (event) => {
        if (isDroging) {
          if (playing) player.pause();
          setDrogEndTime(getEventTime(event));
        }
      },
      [isDroging, playing, player, getEventTime]
    );

    const onDocumentMouseUp = useCallback(() => {
      if (isDroging) {
        if (
          drogStartTime > 0 &&
          drogEndTime > 0 &&
          drogEndTime - drogStartTime >= 0.2
        ) {
          const index = findIndex(subtitles, drogStartTime) + 1;
          const start_time = DT.d2t(drogStartTime);
          const end_time = DT.d2t(drogEndTime);
          addSub(
            index,
            newSub({
              start_time,
              end_time,
              text: "SUB_TEXT",
            })
          );
        }
      }
      setIsDroging(false);
      setDrogStartTime(0);
      setDrogEndTime(0);
    }, [
      isDroging,
      drogStartTime,
      drogEndTime,
      subtitles,
      subtitleEnglish,
      addSub,
      newSub,
      configuration,
    ]);

    useEffect(() => {
      document.addEventListener("mouseup", onDocumentMouseUp);
      return () => document.removeEventListener("mouseup", onDocumentMouseUp);
    }, [onDocumentMouseUp]);

    return (
      <Box
        className={classes.Metronome}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        {player &&
        !playing &&
        drogStartTime &&
        drogEndTime &&
        drogEndTime > drogStartTime ? (
          <Box
            className={classes.template}
            style={{
              left:
                render.padding * gridGap +
                (drogStartTime - render.beginTime) * gridGap * 10,
              width: (drogEndTime - drogStartTime) * gridGap * 10,
            }}
          ></Box>
        ) : null}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.subtitleEnglish, nextProps.subtitleEnglish) &&
      isEqual(prevProps.subtitle, nextProps.subtitle) &&
      isEqual(prevProps.render, nextProps.render)
    );
  }
);

import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  connectMenu,
} from "react-contextmenu";
import React, { useEffect, useCallback, useState } from "react";
import isEqual from "lodash/isEqual";
import DT from "duration-time-conversion";
import { getKeyCode } from "../../../utils/utils";
import ProjectStyle from "../../../styles/ProjectStyle";

function magnetically(time, closeTime) {
  if (!closeTime) return time;
  if (time > closeTime - 0.1 && closeTime + 0.1 > time) {
    return closeTime;
  }
  return time;
}

let lastTarget = null;
let lastSub = null;
let lastType = "";
let lastX = 0;
let lastIndex = -1;
let lastWidth = 0;
let lastDiffX = 0;
let isDroging = false;

function getCurrentSubs(subs, beginTime, duration) {
  return subs?.filter((item) => {
    return (
      (item.startTime >= beginTime && item.startTime <= beginTime + duration) ||
      (item.endTime >= beginTime && item.endTime <= beginTime + duration) ||
      (item.startTime < beginTime && item.endTime > beginTime + duration)
    );
  });
}

export default React.memo(
  function ({
    player,
    subtitles,
    subtitleEnglish,
    render,
    currentTime,
    removeSub,
    hasSub,
    updateSub,
    mergeSub,
    updateSubEnglish,
    configuration,
  }) {
    const classes = ProjectStyle();
    const $blockRef = React.createRef();
    const $subsRef = React.createRef();

    const [currentSubs, setCurrentSubs] = useState([]);

    useEffect(() => {
        let subs = getCurrentSubs(subtitles, render.beginTime, render.duration);
        setCurrentSubs(subs);
    }, [subtitles, render])

    const gridGap = document.body.clientWidth / render.gridNum;
    const currentIndex = subtitles?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );

    // const onMouseDown = (sub, event, type) => {
    //   lastSub = sub;
    //   if (event.button !== 0) return;
    //   isDroging = true;
    //   lastType = type;
    //   lastX = event.pageX;
    //   lastIndex = subtitles.indexOf(sub);
    //   lastTarget = $subsRef.current.children[lastIndex];
    //   lastWidth = parseFloat(lastTarget.style.width);
    // };

    // const onDoubleClick = (sub, event) => {
    //   const $subs = event.currentTarget;
    //   const index = hasSub(sub);
    //   const previou = subtitles[index - 1];
    //   const next = subtitles[index + 1];
    //   if (previou && next) {
    //     const width = (next.startTime - previou.endTime) * 10 * gridGap;
    //     $subs.style.width = `${width}px`;
    //     const start = DT.d2t(previou.endTime);
    //     const end = DT.d2t(next.startTime);

    //     updateSub(sub, {
    //       start,
    //       end,
    //     });
    //   }
    // };

    const onDocumentMouseMove = useCallback((event) => {
      if (isDroging && lastTarget) {
        lastDiffX = event.pageX - lastX;
        if (lastType === "left") {
          lastTarget.style.width = `${lastWidth - lastDiffX}px`;
          lastTarget.style.transform = `translate(${lastDiffX}px)`;
        } else if (lastType === "right") {
          lastTarget.style.width = `${lastWidth + lastDiffX}px`;
        } else {
          lastTarget.style.transform = `translate(${lastDiffX}px)`;
        }
      }
    }, []);

    const onDocumentMouseUp = useCallback(() => {
      if (isDroging && lastTarget && lastDiffX) {
        const timeDiff = lastDiffX / gridGap / 10;
        const index = hasSub(lastSub);
        const previou = subtitles[index - 1];
        const next = subtitles[index + 1];

        const startTime = magnetically(
          lastSub.startTime + timeDiff,
          previou ? previou.endTime : null
        );
        const endTime = magnetically(
          lastSub.endTime + timeDiff,
          next ? next.startTime : null
        );
        const width = (endTime - startTime) * 10 * gridGap;

        if (lastType === "left") {
          if (startTime >= 0 && lastSub.endTime - startTime >= 0.2) {
            const start = DT.d2t(startTime);
            console.log(start, startTime, "start");
            updateSub(lastSub, { start });

            updateSubEnglish(lastSub, { start });
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else if (lastType === "right") {
          if (endTime >= 0 && endTime - lastSub.startTime >= 0.2) {
            const end = DT.d2t(endTime);
            updateSub(lastSub, { end });

            updateSubEnglish(lastSub, { end });
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else {
          if (startTime > 0 && endTime > 0 && endTime - startTime >= 0.2) {
            const start = DT.d2t(startTime);
            const end = DT.d2t(endTime);

            updateSub(lastSub, {
              start,
              end,
            });
            updateSubEnglish(lastSub, {
              start,
              end,
            });
          } else {
            lastTarget.style.width = `${width}px`;
          }
        }
        lastTarget.style.transform = `translate(0)`;
      }

      lastType = "";
      lastX = 0;
      lastWidth = 0;
      lastDiffX = 0;
      isDroging = false;
    }, [gridGap, hasSub, subtitles, updateSub, updateSubEnglish]);

    const onKeyDown = useCallback(
      (event) => {
        const sub = subtitles[lastIndex];
        if (sub && lastTarget) {
          const keyCode = getKeyCode(event);

          switch (keyCode) {
            case 37:
              updateSub(sub, {
                start: DT.d2t(sub.startTime - 0.1),
                end: DT.d2t(sub.endTime - 0.1),
              });
              player.currentTime = sub.startTime - 0.1;
              break;
            case 39:
              updateSub(sub, {
                start: DT.d2t(sub.startTime + 0.1),
                end: DT.d2t(sub.endTime + 0.1),
              });
              player.currentTime = sub.startTime + 0.1;
              break;
            case 8:
            case 46:
              removeSub(sub);
              break;
            default:
              break;
          }
        }
      },
      [subtitles, player, removeSub, updateSub]
    );

    const DynamicMenu = (props) => {
      const { id, trigger } = props;

      return (
        <ContextMenu id={id}>
          {trigger && (
            <MenuItem onClick={() => removeSub(lastSub)}>"Delete"</MenuItem>
          )}
          {trigger &&
            configuration === "Same Language Subtitling" &&
            trigger.parentSub !==
              subtitleEnglish[subtitleEnglish.length - 1] && (
              <MenuItem onClick={() => mergeSub(lastSub)}>"Merge"</MenuItem>
            )}
        </ContextMenu>
      );
    };

    const ConnectedMenu = connectMenu("contextmenu")(DynamicMenu);

    useEffect(() => {
      document.addEventListener("mousemove", onDocumentMouseMove);
      document.addEventListener("mouseup", onDocumentMouseUp);
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("mousemove", onDocumentMouseMove);
        document.removeEventListener("mouseup", onDocumentMouseUp);
        window.removeEventListener("keydown", onKeyDown);
      };
    }, [onDocumentMouseMove, onDocumentMouseUp, onKeyDown]);

    return (
      <div className={classes.parentSubtitleBox} ref={$blockRef}>
        <div ref={$subsRef}>
          {currentSubs?.map((sub, key) => {
            return (
              <div
                className={`${classes.subItem} ${
                  key === currentIndex ? classes.subHighlight : ""
                } `}
                key={key}
                style={{
                  left:
                    render.padding * gridGap +
                    (sub.startTime - render.beginTime) * gridGap * 10,
                  width: (sub.endTime - sub.startTime) * gridGap * 10,
                }}
                onClick={() => {
                  if (player.duration >= sub.startTime) {
                    player.currentTime = sub.startTime + 0.001;
                  }
                }}
                // onDoubleClick={(event) => onDoubleClick(sub, event)}
              >
                <ContextMenuTrigger
                  id="contextmenu"
                  holdToDisplay={-1}
                  parentSub={sub}
                  collect={(props) => props}
                >
                  <div
                    className={classes.subHandle}
                    style={{
                      left: 0,
                      width: 10,
                    }}
                    // onMouseDown={(event) => onMouseDown(sub, event, "left")}
                  ></div>

                  <div
                    className={classes.subText}
                    title={sub.text}
                    // onMouseDown={(event) => onMouseDown(sub, event)}
                  >
                    <p className={classes.subTextP}>{sub.text}</p>
                  </div>

                  <div
                    className={classes.subHandle}
                    style={{
                      right: 0,
                      width: 10,
                    }}
                    // onMouseDown={(event) => onMouseDown(sub, event, "right")}
                  ></div>
                  <div className={classes.subDuration}>{sub.duration}</div>
                </ContextMenuTrigger>
              </div>
            );
          })}
        </div>
        <ConnectedMenu />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.subtitles, nextProps.subtitles) &&
      isEqual(prevProps.render, nextProps.render) &&
      prevProps.currentTime === nextProps.currentTime
    );
  }
);

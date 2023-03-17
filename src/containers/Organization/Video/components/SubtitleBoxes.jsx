import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  connectMenu,
} from "react-contextmenu";
import React, {
  useEffect,
  useCallback,
  useState,
  createRef,
  memo,
} from "react";
import isEqual from "lodash/isEqual";
import DT from "duration-time-conversion";
import { getKeyCode } from "../../../../utils/utils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { setSubtitles } from "../../../../redux/actions/Common";
import C from "../../../../redux/constants";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";
import {
  copySubs,
  formatSub,
  hasSub,
  onMerge,
  onSubtitleDelete,
} from "../../../../utils/subtitleUtils";

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

export default memo(
  function ({ render, currentTime }) {
    const { taskId } = useParams();
    const classes = VideoLandingStyle();
    const dispatch = useDispatch();

    const $blockRef = createRef();
    const $subsRef = createRef();

    const taskDetails = useSelector((state) => state.getTaskDetails.data);
    const subtitles = useSelector((state) => state.commonReducer.subtitles);
    const player = useSelector((state) => state.commonReducer.player);

    const [currentSubs, setCurrentSubs] = useState([]);

    useEffect(() => {
      setCurrentSubs(subtitles);
    }, [subtitles, render]);

    const gridGap = document.body.clientWidth / render.gridNum;
    const currentIndex = subtitles?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );

    const saveTranscript = (taskType) => {
      const reqBody = {
        task_id: taskId,
        payload: {
          payload: subtitles,
        },
      };

      const obj = new SaveTranscriptAPI(reqBody, taskType);
      dispatch(APITransport(obj));
    };

    const removeSub = useCallback((sub) => {
      const index = hasSub(sub);
      const res = onSubtitleDelete(index);
      dispatch(setSubtitles(res, C.SUBTITLES));
      saveTranscript(taskDetails?.task_type);
    }, []);

    const mergeSub = useCallback((sub) => {
      const index = hasSub(sub);
      const res = onMerge(index);
      dispatch(setSubtitles(res, C.SUBTITLES));
      saveTranscript(taskDetails?.task_type);
    }, []);

    const updateSub = useCallback(
      (sub, obj) => {
        const index = hasSub(sub);
        const copySub = copySubs();

        if (index < 0) return;

        const subClone = formatSub(sub);
        Object.assign(subClone, obj);
        if (subClone.check) {
          copySub[index] = subClone;
          dispatch(setSubtitles(copySub, C.SUBTITLES));
        }
      },
      [hasSub, formatSub]
    );

    const onMouseDown = (sub, event, type) => {
      lastSub = sub;
      if (event.button !== 0) return;
      isDroging = true;
      lastType = type;
      lastX = event.pageX;
      lastIndex = subtitles.indexOf(sub);
      lastTarget = $subsRef.current.children[lastIndex];
      lastWidth = parseFloat(lastTarget.style.width);
    };

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
            const start_time = DT.d2t(startTime);
            updateSub(lastSub, { start_time });
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else if (lastType === "right") {
          if (endTime >= 0 && endTime - lastSub.startTime >= 0.2) {
            const end_time = DT.d2t(endTime);
            updateSub(lastSub, { end_time });
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else {
          if (startTime > 0 && endTime > 0 && endTime - startTime >= 0.2) {
            const start_time = DT.d2t(startTime);
            const end_time = DT.d2t(endTime);

            updateSub(lastSub, {
              start_time,
              end_time,
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
    }, [gridGap, hasSub, subtitles, updateSub]);

    const onKeyDown = useCallback(
      (event) => {
        const copySub = copySubs();

        const sub = copySub[lastIndex];
        if (sub && lastTarget) {
          const keyCode = getKeyCode(event);

          switch (keyCode) {
            case 37:
              updateSub(sub, {
                start_time: DT.d2t(sub.startTime - 0.1),
                end_time: DT.d2t(sub.endTime - 0.1),
              });
              player.currentTime = sub.startTime - 0.1;
              break;
            case 39:
              updateSub(sub, {
                start_time: DT.d2t(sub.startTime + 0.1),
                end_time: DT.d2t(sub.endTime + 0.1),
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
        <ContextMenu id={id} className={classes.menuItemNav}>
          {trigger && !taskDetails.task_type.includes("VOICEOVER") && (
            <MenuItem
              className={classes.menuItem}
              onClick={() => removeSub(lastSub)}
            >
              Delete Subtitle
            </MenuItem>
          )}
          {trigger &&
            trigger.parentSub !== subtitles[subtitles.length - 1] &&
            !taskDetails.task_type.includes("VOICEOVER") && (
              <MenuItem
                className={classes.menuItem}
                onClick={() => mergeSub(lastSub)}
              >
                Merge Next
              </MenuItem>
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

    const attributes = {
      className: classes.contextMenu,
    };

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
              >
                <ContextMenuTrigger
                  id="contextmenu"
                  holdToDisplay={-1}
                  parentSub={sub}
                  collect={(props) => props}
                  attributes={attributes}
                >
                  <div
                    className={classes.subHandle}
                    style={{
                      left: 0,
                      width: 10,
                    }}
                    onMouseDown={(event) => onMouseDown(sub, event, "left")}
                  ></div>

                  <div
                    className={classes.subText}
                    title={sub.text}
                    onMouseDown={(event) => onMouseDown(sub, event)}
                  >
                    <p className={classes.subTextP}>
                      {taskDetails.task_type.includes("TRANSCRIPTION") ||
                      taskDetails.task_type.includes("VOICEOVER")
                        ? sub.text
                        : sub.target_text}
                    </p>
                  </div>

                  <div
                    className={classes.subHandle}
                    style={{
                      right: 0,
                      width: 10,
                    }}
                    onMouseDown={(event) => onMouseDown(sub, event, "right")}
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

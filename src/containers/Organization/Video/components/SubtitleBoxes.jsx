import React, {
  useEffect,
  useCallback,
  useState,
  createRef,
  memo,
} from "react";
import isEqual from "lodash/isEqual";
import DT from "duration-time-conversion";
import { useDispatch, useSelector } from "react-redux";
import {
  copySubs,
  getKeyCode,
  hasSub,
  isPlaying,
  onMerge,
  onSubtitleDelete,
} from "utils";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  connectMenu,
} from "react-contextmenu";

//APIs
import C from "redux/constants";
import {
  APITransport,
  FetchTranscriptPayloadAPI,
  SaveTranscriptAPI,
  setSubtitles,
} from "redux/actions";
import { useParams } from "react-router-dom";

function magnetically(time, closeTime) {
  if (!closeTime) return time;
  if (time > closeTime - 0.1 && closeTime + 0.1 > time) {
    return closeTime;
  }
  return time;
}

let lastTarget = null;
let lastSub = null;
let previousTarget = null;
let nextTarget = null;
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
    const limit = useSelector((state) => state.commonReducer.limit);
    const currentPage = useSelector((state) => state.commonReducer.currentPage);
    const next = useSelector((state) => state.commonReducer.nextPage);

    const [currentSubs, setCurrentSubs] = useState([]);

    useEffect(() => {
      if (subtitles) {
        setCurrentSubs(subtitles);
      }
    }, [subtitles]);

    const gridGap = document.body.clientWidth / render.gridNum;
    const currentIndex = currentSubs?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );

    useEffect(() => {
      if (subtitles) {
        const isLastSub =
          player.currentTime > subtitles[subtitles?.length - 1]?.endTime;

          const handleAutosave = () => {
            const reqBody = {
              task_id: taskId,
              offset: currentPage,
              limit: limit,
              payload: {
                payload: subtitles,
              },
            };
      
            const obj = new SaveTranscriptAPI(reqBody, taskDetails?.task_type);
            dispatch(APITransport(obj));
          };

        if (next && isLastSub && isPlaying(player)) {
          handleAutosave();
          const payloadObj = new FetchTranscriptPayloadAPI(
            taskDetails.id,
            taskDetails.task_type,
            next,
            limit
          );
          dispatch(APITransport(payloadObj));
        }
      }

      // eslint-disable-next-line
    }, [subtitles, currentIndex, isPlaying(player)]);

    const removeSub = useCallback(
      (sub) => {
        const index = hasSub(sub);
        const res = onSubtitleDelete(index);
        dispatch(setSubtitles(res, C.SUBTITLES));
      },
      // eslint-disable-next-line
      [limit, currentPage]
    );

    const mergeSub = useCallback(
      (sub) => {
        const index = hasSub(sub);
        const res = onMerge(index);
        dispatch(setSubtitles(res, C.SUBTITLES));
      },
      // eslint-disable-next-line
      [limit, currentPage]
    );

    const updateSub = useCallback(
      (sub, obj) => {
        const index = hasSub(sub);
        const copySub = [...subtitles];

        if (index <= 0) return;
        if (taskDetails.task_type.includes("VOICEOVER")){return}

        Object.assign(sub, obj);

        copySub[index] = sub;
        dispatch(setSubtitles(copySub, C.SUBTITLES));
      },
      // eslint-disable-next-line
      [subtitles]
    );

    const onMouseDown = (index, event, type) => {
      previousTarget = $subsRef.current.children[index - 1];
      lastSub = subtitles[index];
      nextTarget = $subsRef.current.children[index + 1];
      if (event.button !== 0) return;
      isDroging = true;
      lastType = type;
      lastX = event.pageX;
      lastIndex = index;
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
        const nextCardStartTime = endTime;
        const previousCardEndTime = startTime;
        const width = (endTime - startTime) * 10 * gridGap;
        const nextCardWidth = (next?next.endTime:(nextCardStartTime+10) - nextCardStartTime) * 10 * gridGap;
        const previousCardWidth =
          (previousCardEndTime - previou?.startTime?previou.startTime:0) * 10 * gridGap;

        if (lastType === "left") {
          if (startTime >= 0 && lastSub.endTime - startTime >= 0.2) {
            const start_time = DT.d2t(startTime);

            if (index > 0 && startTime >= DT.t2d(previou.end_time)) {
              updateSub(lastSub, { start_time });
            }

            if(index > 0 && startTime < DT.t2d(previou.end_time) && startTime !== DT.t2d(previou.end_time)) {
              if (index!==1){
                updateSub(lastSub, { start_time });
                updateSub(previou, { end_time: start_time });
                previousTarget.style.width = `${previousCardWidth}px`;
              }
            }

            if (index === 0) {
              updateSub(lastSub, { start_time });
            }
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else if (lastType === "right") {
          if (endTime >= 0 && endTime - lastSub.startTime >= 0.2) {
            const end_time = DT.d2t(endTime);

            if (
              index >= 0 &&
              index !== subtitles.length - 1 &&
              endTime <= DT.t2d(next.start_time)
            ) {
              updateSub(lastSub, { end_time });
            }

            if (
              index >= 0 &&
              index !== subtitles.length - 1 &&
              endTime > DT.t2d(next.start_time) && 
              endTime !== DT.t2d(next.start_time)
            ) {
              updateSub(lastSub, { end_time });
              updateSub(next, { start_time: end_time });
              nextTarget.style.width = `${nextCardWidth}px`;
            }

            // //allow last subtitle endtime edit
            // if (index === subtitles.length - 1) {
            //   updateSub(lastSub, { end_time });
            // }
          } else {
            lastTarget.style.width = `${width}px`;
          }
        } else {
          if (startTime > 0 && endTime > 0 && endTime - startTime >= 0.2) {
            const start_time = DT.d2t(startTime);
            const end_time = DT.d2t(endTime);

            if (subtitles.length > 1) {
              if (
                index > 0 &&
                startTime >= DT.t2d(previou.end_time) &&
                endTime <= DT.t2d(next.start_time)
              ) {
                updateSub(lastSub, {
                  start_time,
                  end_time,
                });
              }

              if (index === 0 && endTime <= DT.t2d(next.start_time)) {
                updateSub(lastSub, {
                  start_time,
                  end_time,
                });
              }
            } else {
              updateSub(lastSub, {
                start_time,
                end_time,
              });
            }
          } else {
            lastTarget.style.width = `${width}px`;
          }
        }
        lastTarget.style.transform = `translate(0)`;
        lastTarget.style.width = `${width}px`;
      }

      lastType = "";
      lastX = 0;
      lastWidth = 0;
      lastDiffX = 0;
      isDroging = false;
    }, [gridGap, subtitles, updateSub]);

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
              // player.currentTime = sub.startTime - 0.1;
              break;
            case 39:
              updateSub(sub, {
                start_time: DT.d2t(sub.startTime + 0.1),
                end_time: DT.d2t(sub.endTime + 0.1),
              });
              // player.currentTime = sub.startTime + 0.1;
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
      // eslint-disable-next-line
      [player, removeSub, updateSub]
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
                  key === currentIndex ? classes.subHighlight : classes.subNonHighlight
                } `}
                key={key}
                style={{
                  left:
                    render.padding * gridGap +
                    (sub.startTime - render.beginTime) * gridGap * 10,
                  width: (sub.endTime - sub.startTime) * gridGap * 10,
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
                    onMouseDown={(event) => onMouseDown(key, event, "left")}
                  ></div>

                  <div
                    className={classes.subText}
                    title={sub.text}
                    onMouseDown={(event) => onMouseDown(key, event)}
                  >
                    <p className={classes.subTextP} style={{color: "black"}}>
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
                    onMouseDown={(event) => onMouseDown(key, event, "right")}
                  ></div>
                  <div className={classes.subDuration} style={{color: "black"}}>{sub.duration}</div>
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

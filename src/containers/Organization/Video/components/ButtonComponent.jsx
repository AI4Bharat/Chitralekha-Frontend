import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { memo } from "react";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";
import MicIcon from "@mui/icons-material/MicOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import StopIcon from "@mui/icons-material/Stop";
import { useSelector } from "react-redux";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LyricsIcon from "@mui/icons-material/Lyrics";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useRef } from "react";

const ButtonComponent = ({
  index,
  lastItem,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  onSplitClick,
  showPopOver,
  showSplit,
  handleStartRecording,
  handleStopRecording,
  recordAudio,
  showChangeBtn,
  saveTranscriptHandler,
  showSpeedChangeBtn,
  handlePauseRecording,
  durationError,
  handleFileUpload,
}) => {
  const classes = VideoLandingStyle();
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

  const $audioFile = useRef(null);

  return (
    <>
      {!taskData.task_type.includes("VOICEOVER") && showSplit && (
        <Tooltip title="Split Subtitle" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={onSplitClick}
            disabled={!showPopOver}
          >
            <SplitscreenIcon />
          </IconButton>
        </Tooltip>
      )}

      {!taskData.task_type.includes("VOICEOVER") && lastItem && (
        <Tooltip title="Merge Next" placement="bottom">
          <IconButton
            sx={{ transform: "rotate(180deg)" }}
            className={classes.optionIconBtn}
            onClick={() => onMergeClick(index)}
          >
            <MergeIcon />
          </IconButton>
        </Tooltip>
      )}

      {!taskData.task_type.includes("VOICEOVER") && (
        <Tooltip title="Delete" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            style={{ backgroundColor: "red" }}
            onClick={() => onDelete(index)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      )}

      {!taskData.task_type.includes("VOICEOVER") && (
        <Tooltip title="Add Subtitle Box" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => addNewSubtitleBox(index)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type === "MACHINE_GENERATED" &&
        showChangeBtn && (
          <Tooltip title="Get Updated Audio" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => saveTranscriptHandler(false, true, true)}
            >
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        )}

      {taskData.task_type.includes("VOICEOVER") && showSpeedChangeBtn && (
        <Tooltip title="Get Updated Audio Speed" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => saveTranscriptHandler(false, true, true)}
          >
            <LyricsIcon />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("VOICEOVER") && durationError[index] && (
        <Tooltip
          title="Audio length should be equal or less than duration"
          placement="bottom"
        >
          <IconButton
            className={classes.optionIconBtn}
            style={{ backgroundColor: "red" }}
          >
            <ReportProblemIcon />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type !== "MACHINE_GENERATED" &&
        (recordAudio?.[index] == "stop" || recordAudio?.[index] == "" ? (
          <Tooltip title="Record Audio" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => handleStartRecording(index)}
            >
              <MicIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Stop Recording" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => handleStopRecording(index)}
            >
              <StopIcon />
            </IconButton>
          </Tooltip>
        ))}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type !== "MACHINE_GENERATED" &&
        recordAudio?.[index] === "start" && (
          <Tooltip title="Pause Recording" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => handlePauseRecording(index)}
            >
              <PauseIcon />
            </IconButton>
          </Tooltip>
        )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type !== "MACHINE_GENERATED" &&
        recordAudio?.[index] === "pause" && (
          <Tooltip title="Play Recording" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => handleStartRecording(index)}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type !== "MACHINE_GENERATED" && (
          <Tooltip title="Upload Audio" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => $audioFile.current.click()}
            >
              <UploadIcon />
              <input
                type="file"
                style={{ display: "none" }}
                ref={$audioFile}
                accept="audio/wav, audio/mp3"
                onChange={(event) => handleFileUpload(event, index)}
              />
            </IconButton>
          </Tooltip>
        )}
    </>
  );
};

export default memo(ButtonComponent);

import React, { memo, useRef } from "react";
import { useSelector } from "react-redux";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteIcon from "@mui/icons-material/Delete";
import MicIcon from "@mui/icons-material/MicOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import StopIcon from "@mui/icons-material/Stop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LyricsIcon from "@mui/icons-material/Lyrics";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LoopIcon from "@mui/icons-material/Loop";

const ButtonComponent = ({
  index,
  lastItem,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  handleStartRecording,
  handleStopRecording,
  recordAudio,
  showChangeBtn,
  saveTranscriptHandler,
  showSpeedChangeBtn,
  handlePauseRecording,
  durationError,
  handleFileUpload,
  isDisabled,
  handleReGenerateTranslation,
}) => {
  const classes = VideoLandingStyle();
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

  const $audioFile = useRef(null);

  return (
    <>
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
            style={{ color: "#d32f2f" }}
            onClick={() => onDelete(index)}
          >
            <DeleteIcon />
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

      {taskData.task_type.includes("TRANSLATION") && (
        <Tooltip title="Regenerate Translation" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handleReGenerateTranslation(index)}
          >
            <LoopIcon />
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
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            <ReportProblemIcon />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type !== "MACHINE_GENERATED" &&
        (recordAudio?.[index] === "stop" || recordAudio?.[index] === "" ? (
          <Tooltip title="Record Audio" placement="bottom">
            <IconButton
              style={{ display: isDisabled ? "none" : "" }}
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
              style={{ display: isDisabled ? "none" : "" }}
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

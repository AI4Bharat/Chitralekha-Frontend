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
}) => {
  const classes = VideoLandingStyle();
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

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
              onClick={() => saveTranscriptHandler(false, true)}
            >
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        )}

      {taskData.task_type.includes("VOICEOVER") &&
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

      {taskData.task_type.includes("VOICEOVER") && (
        <Tooltip title="Upload Audio" placement="bottom">
          <IconButton className={classes.optionIconBtn} onClick={() => {}}>
            <UploadIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default memo(ButtonComponent);

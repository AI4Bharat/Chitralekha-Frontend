import React, { memo } from "react";
import { useSelector } from "react-redux";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LyricsIcon from "@mui/icons-material/Lyrics";
import LoopIcon from "@mui/icons-material/Loop";

const ButtonComponent = ({
  index,
  lastItem,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  showChangeBtn,
  saveTranscriptHandler,
  showSpeedChangeBtn,
  handleReGenerateTranslation,
}) => {
  const classes = VideoLandingStyle();
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

  return (
    <>
      {taskData.task_type.includes("TRANSCRIPTION") && lastItem && (
        <Tooltip title="Merge Next" placement="bottom">
          <IconButton
            sx={{ transform: "rotate(180deg)" }}
            className={classes.optionIconBtn}
            onClick={() => onMergeClick(index)}
          >
            <MergeIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("TRANSCRIPTION") && (
        <Tooltip title="Delete" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            style={{ color: "#d32f2f" }}
            onClick={() => onDelete(index)}
          >
            <DeleteIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("TRANSCRIPTION") && (
        <Tooltip title="Add Subtitle Box" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => addNewSubtitleBox(index)}
          >
            <AddIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("TRANSLATION") && (
        <Tooltip title="Regenerate Translation" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handleReGenerateTranslation(index)}
          >
            <LoopIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {taskData.task_type.includes("VOICEOVER") &&
        transcriptPayload.source_type === "MACHINE_GENERATED" &&
        (
          <Tooltip title="Get Updated Audio" placement="bottom">
            <IconButton
              className={classes.optionIconBtn}
              onClick={() => saveTranscriptHandler(false, true)}
              disabled={!showChangeBtn}
            >
              <TaskAltIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
        )}

      {taskData.task_type.includes("VOICEOVER") && showSpeedChangeBtn && (
        <Tooltip title="Get Updated Audio Speed" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => saveTranscriptHandler(false, true)}
          >
            <LyricsIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default memo(ButtonComponent);

import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { memo } from "react";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";

const ButtonComponent = ({
  index,
  lastItem,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  onSplitClick,
  showPopOver,
  showSplit,
}) => {
  const classes = VideoLandingStyle();

  return (
    <>
      {showSplit && (
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

      {lastItem && (
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

      <Tooltip title="Delete" placement="bottom">
        <IconButton
          className={classes.optionIconBtn}
          style={{ backgroundColor: "red" }}
          onClick={() => onDelete(index)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add Subtitle Box" placement="bottom">
        <IconButton
          className={classes.optionIconBtn}
          onClick={() => addNewSubtitleBox(index)}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default memo(ButtonComponent);

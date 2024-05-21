import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { fontMenu } from "utils";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import {
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  Tooltip,
  Typography,
  MenuItem,
} from "@mui/material";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import { FindAndReplace, PreviewDialog } from "common";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const anchorOrigin = {
  vertical: "top",
  horizontal: "center",
};

const transformOrigin = {
  vertical: "top",
  horizontal: "center",
};

const SettingsButtonComponent = ({
  setTransliteration,
  enableTransliteration,
  subsuper,
  currentSubs,
  setsubsuper,
  setRTL_Typing,
  enableRTL_Typing,
  currentIndexToSplitTextBlock,
  setFontSize,
  fontSize,
  saveTranscriptHandler,
  setOpenConfirmDialog,
  durationError,
  onUndo,
  onRedo,
  undoStack,
  redoStack,
  onSplitClick,
  handleSuperscript,
  handleSubscript,
  showPopOver,
  showSplit,
  handleInfoButtonClick,
  currentIndex,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  subtitles,
}) => {
  const classes = VideoLandingStyle();
  
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const taskData = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );
  const completedCount = useSelector(
    (state) => state.commonReducer.completedCount
  );
  const totalSentences = useSelector(
    (state) => state.commonReducer.totalSentences
  );

  const getDisbled = (flag) => {
    if (!transcriptPayload?.payload?.payload?.length) {
      return true;
    }

    if (
      taskData?.task_type?.includes("VOICEOVER") &&
      transcriptPayload?.source_type !== "MACHINE_GENERATED"
    ) {
      if (durationError?.some((item) => item === true)) {
        return true;
      }

      if (flag && completedCount !== totalSentences) {
        return true;
      }
    }

    if (
      !taskData?.task_type?.includes("VOICEOVER") &&
      transcriptPayload?.source_type === "MACHINE_GENERATED"
    ) {
      if (!transcriptPayload?.payload?.payload.length) {
        return true;
      }
    }

    return false;
  };

  const handleScript = () => {
    setAnchorElSettings(null);
    setsubsuper(!subsuper);

    if (taskData.task_type === "TRANSCRIPTION_EDIT") {
      localStorage.setItem(
        "subscriptSuperscriptPreferenceTranscript",
        !subsuper
      );
    }

    if (taskData.task_type === "TRANSLATION_EDIT") {
      localStorage.setItem("subscriptSuperscriptPreferenceTanslate", !subsuper);
    }
  };

  return (
    <>
      {!taskData?.task_type?.includes("VOICEOVER") && (
        <>
          <Tooltip title="Merge Next" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              disabled={currentIndex==-1 || currentIndex >= subtitles?.length - 1}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              style={{
                transform: "rotate(180deg)"
              }}
              onClick={() => onMergeClick(currentIndex)}
            >
              <MergeIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              disabled={currentIndex==-1}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              onClick={() => onDelete(currentIndex)}
            >
              <DeleteIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Subtitle Box" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              disabled={currentIndex==-1}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              onClick={() => addNewSubtitleBox(currentIndex)}
            >
              <AddIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" className={classes.rightPanelDivider} />
        </>
      )}

      {!taskData?.task_type?.includes("VOICEOVER") && showSplit && (
        <Tooltip title="Split Subtitle" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onSplitClick}
            disabled={!showPopOver}
            sx={{
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
          >
            <SplitscreenIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {taskData?.task_type?.includes("TRANSCRIPTION") && (
        <Divider orientation="vertical" className={classes.rightPanelDivider} />
      )}

      <Tooltip title="Incorrect Subtitles Info" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={handleInfoButtonClick}
        >
          <InfoOutlinedIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElSettings}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElSettings)}
        onClose={() => setAnchorElSettings(null)}
      >
        <MenuItem>
          <FormControlLabel
            label="Transliteration"
            control={
              <Checkbox
                checked={enableTransliteration}
                onChange={() => {
                  setAnchorElSettings(null);
                  setTransliteration(!enableTransliteration);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="RTL Typing"
            control={
              <Checkbox
                checked={enableRTL_Typing}
                onChange={() => {
                  setAnchorElSettings(null);
                  setRTL_Typing(!enableRTL_Typing);
                }}
              />
            }
          />
        </MenuItem>

        <MenuItem>
          <FormControlLabel
            label="Subscript/Superscript"
            control={<Checkbox checked={subsuper} onChange={handleScript} />}
          />
        </MenuItem>
      </Menu>
      
      {subsuper && (
        <>
        <Divider
            orientation="vertical"
            className={classes.rightPanelDivider}
          />
      
        <Tooltip title="SubScript" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={() => handleSubscript()}
          >
            <SubscriptIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      
      <Tooltip title="SuperScript" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{ marginLeft: "5px" }}
          onClick={() => handleSuperscript(currentIndexToSplitTextBlock)}
        >
          <SuperscriptIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>
        </>
      )}

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Font Size" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElFont(event.currentTarget)}
        >
          <FormatSizeIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElFont}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {fontMenu.map((item, index) => (
          <MenuItem key={index} onClick={(event) => setFontSize(item.size)}>
            <CheckIcon
              style={{
                visibility: fontSize === item.size ? "" : "hidden",
              }}
            />
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontSize: item.size, marginLeft: "10px" }}
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <FindAndReplace
        subtitleDataKey={
          taskData?.task_type?.includes("TRANSLATION") ? "target_text" : "text"
        }
        taskType={taskData?.task_type}
      />

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Save" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          disabled={getDisbled()}
          onClick={() => saveTranscriptHandler(false)}
        >
          <SaveIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Subtitle Preview" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={() => setOpenPreviewDialog(true)}
          >
            <VisibilityIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Complete" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          disabled={getDisbled("complete")}
          onClick={() => setOpenConfirmDialog(true)}
        >
          <VerifiedIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Undo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onUndo}
            disabled={undoStack?.length === 0}
          >
            <UndoIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Redo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onRedo}
            disabled={redoStack?.length === 0}
          >
            <RedoIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {openPreviewDialog && (
        <PreviewDialog
          openPreviewDialog={openPreviewDialog}
          handleClose={() => setOpenPreviewDialog(false)}
          taskType={taskData?.task_type}
          currentSubs={currentSubs}
          videoId={taskData?.video}
          targetLanguage={taskData?.target_language}
        />
      )}
    </>
  );
};

export default memo(SettingsButtonComponent);

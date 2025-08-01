import React, { memo, useEffect, useState } from "react";
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
  CircularProgress,
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
import LoopIcon from "@mui/icons-material/Loop";
import ExpandIcon from "@mui/icons-material/Expand";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BookmarkIcon from '@mui/icons-material/BookmarkBorderOutlined';
import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import NoPhotographyOutlinedIcon from '@mui/icons-material/NoPhotographyOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

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
  handleInfoButtonClick,
  currentIndex,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
  subtitles,
  handleReGenerateTranslation,
  expandTimestamp,
  handleGetUpdatedAudioForAll,
  bookmarkSegment,
  setOpenExportDialog,
  disabled,
  enableScreenShots,
  setEnableScreenShots,
  videoLinkExpired,
}) => {
  const classes = VideoLandingStyle();
  
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [apiInProgress, setApiInProgress] = useState(false);

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
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    setApiInProgress(progress);
  }, [apiStatus]);

  const getDisbled = (flag) => {

    if (taskData?.source_type === "Manually Created") {
      return false;
    }

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
      {taskData?.task_type?.includes("TRANSCRIPTION") && (
        <>
          <Tooltip title="Add Subtitle Box" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              disabled={disabled ? disabled : (currentIndex === -1 && taskData?.source_type !== "Manually Created")}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              onClick={() => addNewSubtitleBox(currentIndex)}
            >
              <AddIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              disabled={disabled ? disabled : currentIndex === -1}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              onClick={() => onDelete(currentIndex)}
            >
              <DeleteIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
        </>
      )}

      {!taskData?.task_type?.includes("VOICEOVER") && (
      <>
        <Tooltip title="Merge Next" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            disabled={disabled ? disabled : (currentIndex===-1 || currentIndex >= subtitles?.length - 1)}
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

        <Tooltip title="Split Subtitle" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onSplitClick}
            disabled={disabled ? disabled : !showPopOver}
            sx={{
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
          >
            <SplitscreenIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      </>)
      }

        <Tooltip title="Expand Timestamp" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={expandTimestamp}
            disabled={disabled ? disabled : currentIndex===-1}
            sx={{
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
            style={{
              transform: "rotate(90deg)"
            }}
          >
            <ExpandIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>

      {taskData?.task_type?.includes("TRANSCRIPTION") && taskData?.status === "PARAPHRASE" && (
        <Tooltip title="Paraphrase All Segments" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={() => handleReGenerateTranslation("paraphrase")}
            sx={{
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
            disabled={disabled ? disabled : apiInProgress}
          >
            <LoopIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

        {taskData?.task_type?.includes("TRANSLATION") && (
            <>
            <Tooltip title={taskData?.task_type?.includes("VOICEOVER") ? "Regenerate Translation For All Segments" : "Regenerate Translation"} placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              onClick={() => handleReGenerateTranslation(currentIndex)}
              sx={{
                "&.Mui-disabled": { backgroundColor: "lightgray" },
              }}
              disabled={disabled ? disabled : apiInProgress}
            >
              <LoopIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
          {taskData?.task_type?.includes("VOICEOVER") && taskData?.source_type === "Machine Generated" &&
            <Tooltip title="Get Updated Audio For All Segments" placement="bottom">
              <IconButton
                className={classes.rightPanelBtnGrp}
                onClick={() => handleGetUpdatedAudioForAll()}
                sx={{
                  "&.Mui-disabled": { backgroundColor: "lightgray" },
                }}
                disabled={disabled ? disabled :apiInProgress}
              >
                <TaskAltIcon className={classes.rightPanelSvg} />
              </IconButton>
            </Tooltip>
          }
          </>
        )}

        <Tooltip title="Bookmark Segment" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={bookmarkSegment}
            disabled={disabled ? disabled : (currentIndex===-1 || apiInProgress)}
            sx={{
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
          >
            <BookmarkIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>


        <Divider orientation="vertical" className={classes.rightPanelDivider} />

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
          disabled={disabled}
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
            disabled={disabled}
          >
            <SubscriptIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      
      <Tooltip title="SuperScript" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{ marginLeft: "5px" }}
          onClick={() => handleSuperscript(currentIndexToSplitTextBlock)}
          disabled={disabled}
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
          disabled={disabled}
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
          taskData?.task_type?.includes("TRANSLATION") ? taskData?.task_type?.includes("VOICEOVER") ? "text" : "target_text" : "text"
        }
        taskType={taskData?.task_type}
        currentSubs={currentSubs}
        videoId={taskData?.video}
        targetLanguage={taskData?.target_language}
        disabled={disabled}
      />

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Save" placement="bottom">
        <>
        {apiInProgress ?
        <CircularProgress size={35} style={{margin:"auto 6px auto 0px", padding:"0"}}/>
        :
        <IconButton
          className={classes.rightPanelBtnGrp}
          disabled={disabled ? disabled : getDisbled()}
          onClick={() => saveTranscriptHandler(false)}
        >
          <SaveIcon className={classes.rightPanelSvg} />
        </IconButton>
        }
        </>
      </Tooltip>

      {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Subtitle Preview" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={() => setOpenPreviewDialog(true)}
            disabled={disabled}
          >
            <VisibilityIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

        <Tooltip title="Undo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onUndo}
            disabled={disabled ? disabled : undoStack?.length === 0}
          >
            <UndoIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onRedo}
            disabled={disabled ? disabled : redoStack?.length === 0}
          >
            <RedoIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>

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

      <Divider orientation="vertical" className={classes.rightPanelDivider} />
      
      <Tooltip title="Complete" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          disabled={disabled ? disabled : (getDisbled("complete") || apiInProgress)}
          onClick={() => setOpenConfirmDialog(true)}
          style={{backgroundColor:"red"}}
        >
          <VerifiedIcon className={classes.rightPanelSvg}/>
        </IconButton>
      </Tooltip>

      {taskData?.task_type?.includes("TRANSLATION_VOICEOVER") && 
        <>
          <Divider orientation="vertical" className={classes.rightPanelDivider} />

          <Tooltip title="Export" placement="bottom">
            <IconButton
              className={classes.rightPanelBtnGrp}
              onClick={() => {setOpenExportDialog(true)}}
              disabled={disabled}
            >
              <DownloadIcon className={classes.rightPanelSvg} />
            </IconButton>
          </Tooltip>
          </>
      }
      {(taskData?.task_type?.includes("TRANSLATION_VOICEOVER") || taskData?.task_type?.includes("TRANSCRIPTION")) && 
        <>
          {taskData?.task_type?.includes("TRANSCRIPTION") && <Divider orientation="vertical" className={classes.rightPanelDivider} />}
          {enableScreenShots ?
            <Tooltip title="Hide Screenshots" placement="bottom">
              <IconButton
                className={classes.rightPanelBtnGrp}
                onClick={() => { setEnableScreenShots(!enableScreenShots) }}
                disabled={disabled || apiInProgress || videoLinkExpired}
                sx={{
                  "&.Mui-disabled": { backgroundColor: "lightgray" },
                }}
              >
                <NoPhotographyOutlinedIcon className={classes.rightPanelSvg} />
              </IconButton>
            </Tooltip> :
            <Tooltip title="Show Screenshots" placement="bottom">
              <IconButton
                className={classes.rightPanelBtnGrp}
                onClick={() => { setEnableScreenShots(!enableScreenShots) }}
                disabled={disabled || apiInProgress || videoLinkExpired}
                sx={{
                  "&.Mui-disabled": { backgroundColor: "lightgray" },
                }}
              >
                <CameraAltOutlinedIcon className={classes.rightPanelSvg} />
              </IconButton>
            </Tooltip>
          }
        </>
        }
    </>
  );
};

export default memo(SettingsButtonComponent);

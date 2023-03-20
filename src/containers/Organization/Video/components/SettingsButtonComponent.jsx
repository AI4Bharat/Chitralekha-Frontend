import {
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  Tooltip,
  Typography,
  MenuItem
} from "@mui/material";
import React, { memo, useState } from "react";
import FindAndReplace from "../../../../common/FindAndReplace";
import VideoLandingStyle from "../../../../styles/videoLandingStyles";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';
import { fontMenu } from "../../../../utils/subtitleUtils";

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
  setRTL_Typing,
  enableRTL_Typing,
  setFontSize,
  fontSize,
  saveTranscriptHandler,
  setOpenConfirmDialog,
  // onUndo,
  // onRedo,
  // undoStack,
  // redoStack,
}) => {
  const classes = VideoLandingStyle();

  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);

  return (
    <>
      <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon />
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
      </Menu>

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Font Size" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElFont(event.currentTarget)}
        >
          <FormatSizeIcon />
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

      {/* <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElFont}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {fontMenu.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              setFontSize(item.size);
            }}
          >
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
      </Menu> */}

      <FindAndReplace subtitleDataKey={"text"} />

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Save" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={() => saveTranscriptHandler(false, true)}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Complete" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{ marginLeft: "5px" }}
          onClick={() => setOpenConfirmDialog(true)}
        >
          <VerifiedIcon />
        </IconButton>
      </Tooltip>

      {/* <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Undo" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={onUndo}
          disabled={undoStack?.length === 0}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Redo" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{ marginLeft: "5px" }}
          onClick={onRedo}
          disabled={redoStack?.length === 0}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip> */}
    </>
  );
};

export default memo(SettingsButtonComponent);

import { Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckIcon from "@mui/icons-material/Check";
import { fontMenu, playbackSpeed, themeMenu } from "../utils/subtitleUtils";

const CustomMenuComponent = ({
  anchorElSettings,
  handleClose,
  setFontSize,
  fontSize,
  darkAndLightMode,
  setDarkAndLightMode,
  player,
  contianer,
}) => {
  const [anchorElFonts, setAnchorElFonts] = useState(null);
  const [anchorElTheme, setAnchorElTheme] = useState(null);
  const [anchorElPlayback, setAnchorElPlayback] = useState(null);

  const settingsMenu = [
    {
      label: "Font Size",
      onClick: (event) => setAnchorElFonts(event.currentTarget),
    },
    {
      label: "Playback Speed",
      onClick: (event) => setAnchorElPlayback(event.currentTarget),
    },
    {
      label: "Theme",
      onClick: (event) => setAnchorElTheme(event.currentTarget),
    },
  ];

  return (
    <>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElSettings}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorElSettings)}
        onClose={handleClose}
        container={contianer}
      >
        {settingsMenu.map((item, index) => (
          <MenuItem key={index} onClick={(event) => item.onClick(event)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>{item.label}</span>
              <NavigateNextIcon />
            </div>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="menu-appbar"
        anchorEl={anchorElFonts}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElFonts)}
        onClose={() => setAnchorElFonts(null)}
        container={contianer}
      >
        {fontMenu.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              setFontSize(item.size);
              setAnchorElFonts(null);
              handleClose();
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
      </Menu>

      <Menu
        id="menu-appbar"
        anchorEl={anchorElPlayback}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElPlayback)}
        onClose={() => setAnchorElPlayback(null)}
        container={contianer}
      >
        {playbackSpeed.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              player.playbackRate = item.speed;
              setAnchorElPlayback(null);
              handleClose();
            }}
          >
            <CheckIcon
              style={{
                visibility: player?.playbackRate === item.speed ? "" : "hidden",
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

      <Menu
        id="menu-appbar"
        anchorEl={anchorElTheme}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElTheme)}
        onClose={() => {
          setAnchorElTheme(null);
        }}
        container={contianer}
      >
        {themeMenu.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              setDarkAndLightMode(item.mode);
              setAnchorElTheme(null);
              handleClose();
            }}
          >
            <CheckIcon
              style={{
                visibility: darkAndLightMode === item.mode ? "" : "hidden",
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
    </>
  );
};

export default CustomMenuComponent;

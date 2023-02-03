// TranslationRightPanel

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import {
  CardContent,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import FindAndReplace from "../../../common/FindAndReplace";
import C from "../../../redux/constants";
import { setSubtitles } from "../../../redux/actions/Common";
import { getUpdatedTime } from "../../../utils/utils";
import TimeBoxes from "../../../common/TimeBoxes";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmDialog from "../../../common/ConfirmDialog";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  addSubtitleBox,
  fontMenu,
  onMerge,
  onSubtitleDelete,
  timeChange,
} from "../../../utils/subtitleUtils";
import ButtonComponent from "./ButtonComponent";
import { memo } from "react";

const TranslationRightPanel = ({ currentIndex, player }) => {
  const { taskId } = useParams();
  const classes = ProjectStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);

  const [sourceText, setSourceText] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [enableTransliteration, setTransliteration] = useState(true);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [fontSize, setFontSize] = useState("large");

  const onDelete = useCallback(
    (index) => {
      const sub = onSubtitleDelete(sourceText, index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    [sourceText]
  );

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  const onMergeClick = useCallback(
    (index) => {
      const sub = onMerge(sourceText, index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      saveTranscriptHandler(false, true, sub);
    },
    [sourceText]
  );

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  useEffect(() => {
    const subtitleScrollEle = document.getElementById(
      "subtitleContainerTranslation"
    );
    subtitleScrollEle
      .querySelector(`#sub_${currentIndex}`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentIndex]);

  const onReplacementDone = (updatedSource) => {
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    saveTranscriptHandler(false, true);
  };

  const changeTranscriptHandler = (text, index, type) => {
    const arr = [...sourceText];

    arr.forEach((element, i) => {
      if (index === i) {
        if (type === "transaltion") {
          element.target_text = text;
        } else {
          element.text = text;
        }
      }
    });

    dispatch(setSubtitles(arr, C.SUBTITLES));
    saveTranscriptHandler(false, false);
  };

  const saveTranscriptHandler = async (isFinal, isAutosave) => {
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: sourceText,
      },
    };

    if (isFinal) {
      reqBody.final = true;
    }

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setLoading(false);

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message
          ? resp?.message
          : isAutosave
          ? "Saved as draft"
          : "Translation Submitted Successfully",
        variant: "success",
      });
      if (isFinal) {
        setTimeout(() => {
          navigate(
            `/my-organization/${assignedOrgId}/project/${taskData?.project}`
          );
        }, 2000);
      }
    } else {
      setLoading(false);

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const handleTimeChange = useCallback(
    (value, index, type, time) => {
      const sub = timeChange(sourceText, value, index, type, time);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    [sourceText]
  );

  const addNewSubtitleBox = useCallback(
    (index) => {
      const sub = addSubtitleBox(sourceText, index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    [sourceText]
  );

  const sourceLength = (index) => {
    if (sourceText[index]?.text.trim() !== "")
      return sourceText[index]?.text.trim().split(" ").length;
    return 0;
  };

  const targetLength = (index) => {
    if (sourceText[index]?.target_text.trim() !== "")
      return sourceText[index]?.target_text.trim().split(" ").length;
    return 0;
  };

  return (
    <>
      {renderSnackBar()}
      <Box
        sx={{
          display: "flex",
          border: fullscreen ? "" : "1px solid #eaeaea",
        }}
        //   width="25%"
        flexDirection="column"
      >
        <Grid
          display={"flex"}
          direction={"row"}
          flexWrap={"wrap"}
          margin={"23.5px 0"}
          justifyContent="center"
        >
          <>
            <Tooltip title="Settings" placement="bottom">
              <IconButton
                sx={{
                  backgroundColor: "#2C2799",
                  borderRadius: "50%",
                  color: "#fff",
                  marginX: "5px",
                  "&:hover": {
                    backgroundColor: "#271e4f",
                  },
                }}
                onClick={(event) => setAnchorElSettings(event.currentTarget)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
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
              onClose={handleCloseSettingsMenu}
            >
              <MenuItem>
                <FormControlLabel
                  label="Transliteration"
                  control={
                    <Checkbox
                      checked={enableTransliteration}
                      onChange={() => {
                        handleCloseSettingsMenu();
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
                        handleCloseSettingsMenu();
                        setRTL_Typing(!enableRTL_Typing);
                      }}
                    />
                  }
                />
              </MenuItem>
            </Menu>
          </>

          <Divider
            orientation="vertical"
            style={{
              border: "1px solid lightgray",
              height: "auto",
              margin: "0 5px",
            }}
          />

          <Tooltip title="Font Size" placement="bottom">
            <IconButton
              sx={{
                backgroundColor: "#2C2799",
                borderRadius: "50%",
                color: "#fff",
                marginX: "5px",
                "&:hover": {
                  backgroundColor: "#271e4f",
                },
              }}
              onClick={(event) => setAnchorElFont(event.currentTarget)}
            >
              <FormatSizeIcon />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElFont}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={Boolean(anchorElFont)}
            onClose={() => setAnchorElFont(null)}
          >
            {fontMenu.map((item, index) => (
              <MenuItem key={index} onClick={() => setFontSize(item.size)}>
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
            sourceData={sourceText}
            subtitleDataKey={"target_text"}
            onReplacementDone={onReplacementDone}
            enableTransliteration={enableTransliteration}
            transliterationLang={taskData?.target_language}
          />

          <Divider
            orientation="vertical"
            style={{
              border: "1px solid lightgray",
              height: "auto",
              margin: "0 5px",
            }}
          />

          <Tooltip title="Save" placement="bottom">
            <IconButton
              sx={{
                backgroundColor: "#2C2799",
                borderRadius: "50%",
                marginX: "5px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#271e4f",
                },
              }}
              onClick={() => saveTranscriptHandler(false, true)}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Complete" placement="bottom">
            <IconButton
              sx={{
                backgroundColor: "#2C2799",
                borderRadius: "50%",
                color: "#fff",
                marginX: "5px",
                "&:hover": {
                  backgroundColor: "#271e4f",
                },
              }}
              onClick={() => setOpenConfirmDialog(true)}
            >
              <VerifiedIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #eaeaea",
            overflowY: "scroll",
            overflowX: "hidden",
            height: window.innerHeight * 0.667,
            backgroundColor: "black",
            marginTop: "5px",
          }}
          id={"subtitleContainerTranslation"}
          className={"subTitleContainer"}
        >
          {sourceText?.map((item, index) => {
            console.log(
              "diff",
              index,
              sourceLength(index),
              targetLength(index),
              sourceLength(index) - targetLength(index)
            );
            return (
              <Box id={`sub_${index}`}>
                <Box
                  display="flex"
                  paddingTop="16px"
                  sx={{ paddingX: "20px", justifyContent: "space-around" }}
                >
                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.start_time}
                    index={index}
                    type={"startTime"}
                  />

                  <ButtonComponent
                    index={index}
                    sourceText={sourceText}
                    onMergeClick={onMergeClick}
                    onDelete={onDelete}
                    addNewSubtitleBox={addNewSubtitleBox}
                  />

                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.end_time}
                    index={index}
                    type={"endTime"}
                  />
                </Box>

                <CardContent
                  sx={{ display: "flex", padding: "5px 0", borderBottom: 2 }}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
                        player.currentTime = item.startTime + 0.001;
                      }
                    }
                  }}
                >
                  <div style={{ position: "relative", width: "100%" }}>
                    <textarea
                      rows={4}
                      className={`${classes.textAreaTransliteration} ${
                        currentIndex === index ? classes.boxHighlight : ""
                      }`}
                      dir={enableRTL_Typing ? "rtl" : "ltr"}
                      style={{ fontSize: fontSize, height: "100px" }}
                      value={item.text}
                      onChange={(event) => {
                        changeTranscriptHandler(
                          event.target.value,
                          index,
                          "transcript"
                        );
                      }}
                    />
                    <span
                      style={{
                        background: "white",
                        color:
                          Math.abs(sourceLength(index) - targetLength(index)) >=
                          3
                            ? "red"
                            : "green",
                        fontWeight: 700,
                        height: "20px",
                        width: "30px",
                        borderRadius: "50%",
                        position: "absolute",
                        bottom: "-10px",
                        left: "25px",
                        textAlign: "center",
                      }}
                    >
                      {sourceLength(index)}
                    </span>
                  </div>

                  {enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.target_language}
                      value={item.target_text}
                      // onChangeText={(text, index) => {}}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index, "transaltion");
                      }}
                      containerStyles={{
                        width: "100%",
                      }}
                      style={{ fontSize: fontSize, height: "100px" }}
                      renderComponent={(props) => (
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <textarea
                            className={`${classes.textAreaTransliteration} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={4}
                            {...props}
                          />
                          <span
                            style={{
                              background: "white",
                              color:
                                Math.abs(
                                  sourceLength(index) - targetLength(index)
                                ) >= 3
                                  ? "red"
                                  : "green",
                              fontWeight: 700,
                              height: "20px",
                              width: "30px",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: "-10px",
                              right: "25px",
                              textAlign: "center",
                            }}
                          >
                            {targetLength(index)}
                          </span>
                        </div>
                      )}
                    />
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <textarea
                        rows={4}
                        className={`${classes.textAreaTransliteration} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        style={{ fontSize: fontSize, height: "100px" }}
                        onChange={(event) => {
                          changeTranscriptHandler(
                            event.target.value,
                            index,
                            "transaltion"
                          );
                        }}
                        value={item.target_text}
                      />
                      <span
                        style={{
                          background: "white",
                          color:
                            Math.abs(
                              sourceLength(index) - targetLength(index)
                            ) >= 3
                              ? "red"
                              : "green",
                          fontWeight: 700,
                          height: "20px",
                          width: "30px",
                          borderRadius: "50%",
                          position: "absolute",
                          bottom: "-10px",
                          right: "25px",
                          textAlign: "center",
                        }}
                      >
                        {targetLength(index)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Box>
            );
          })}
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true, false)}
            message={"Do you want to submit the translation?"}
            loading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default memo(TranslationRightPanel);

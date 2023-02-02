import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  CardContent,
  Grid,
  Typography,
  IconButton,
  Tooltip,
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
import { useNavigate, useParams } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import FindAndReplace from "../../../common/FindAndReplace";
import { setSubtitles } from "../../../redux/actions/Common";
import C from "../../../redux/constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MergeIcon from "@mui/icons-material/Merge";
import TimeBoxes from "../../../common/TimeBoxes";

import ConfirmDialog from "../../../common/ConfirmDialog";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  addSubtitleBox,
  fontMenu,
  newSub,
  onMerge,
  onSplit,
  onSubtitleDelete,
  timeChange,
} from "../../../utils/subtitleUtils";
import ButtonComponent from "./ButtonComponent";
import { memo } from "react";

const RightPanel = ({ currentIndex, player }) => {
  const { taskId } = useParams();
  const classes = ProjectStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const [showPopOver, setShowPopOver] = useState(false);
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [fontSize, setFontSize] = useState("large");
  const [anchorElSettings, setAnchorElSettings] = useState(null);

  useEffect(() => {
    if (subtitles?.length === 0) {
      const defaultSubs = [
        newSub({
          start_time: "00:00:00.000",
          end_time: "00:00:00.000",
          text: "Please type here..",
        }),
      ];
      dispatch(setSubtitles(defaultSubs, C.SUBTITLES));
    } else setSourceText(subtitles);
  }, [subtitles, newSub, dispatch]);

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  useEffect(() => {
    const subtitleScrollEle = document.getElementById("subTitleContainer");
    subtitleScrollEle
      .querySelector(`#sub_${currentIndex}`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentIndex]);

  const onMergeClick = useCallback(
    (index) => {
      const sub = onMerge(sourceText, index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      saveTranscriptHandler(false, true, sub);
    },
    [sourceText]
  );

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value.length) {
      e.preventDefault();
      setShowPopOver(true);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  const onSplitClick = useCallback(() => {
    const sub = onSplit(
      sourceText,
      currentIndexToSplitTextBlock,
      selectionStart
    );

    dispatch(setSubtitles(sub, C.SUBTITLES));
    saveTranscriptHandler(false, true, sub);
  }, [sourceText, currentIndexToSplitTextBlock, selectionStart]);

  const onReplacementDone = (updatedSource) => {
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    saveTranscriptHandler(false, true);
  };

  const changeTranscriptHandler = useCallback(
    (text, index) => {
      const arr = [...sourceText];
      arr.forEach((element, i) => {
        if (index === i) {
          element.text = text;
        }
      });

      dispatch(setSubtitles(arr, C.SUBTITLES));
      saveTranscriptHandler(false, false);
    },
    [sourceText]
  );

  const saveTranscriptHandler = async (
    isFinal,
    isAutosave,
    payload = sourceText
  ) => {
    setLoading(true);
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: payload,
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
      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message
          ? resp?.message
          : isAutosave
          ? "Saved as draft"
          : "",
        variant: "success",
      });
      setLoading(false);
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
        message: "Failed",
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

  const onDelete = useCallback(
    (index) => {
      const sub = onSubtitleDelete(sourceText, index);
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

  const targetLength = (index) => {
    if (sourceText[index]?.text.trim() !== "")
      return sourceText[index]?.text.trim().split(" ").length;
    return 0;
  };

  return (
    <>
      {renderSnackBar()}
      <Box
        sx={{
          display: "flex",
          border: "1px solid #eaeaea",
        }}
        flexDirection="column"
      >
        <Grid
          display={"flex"}
          direction={"row"}
          flexWrap={"wrap"}
          margin={"23.5px 0"}
          justifyContent={"center"}
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
            subtitleDataKey={"text"}
            onReplacementDone={onReplacementDone}
            enableTransliteration={enableTransliteration}
            transliterationLang={taskData?.src_language}
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
                color: "#fff",
                marginX: "5px",
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
            // color: "white",
            marginTop: "5px",
            width: "100%",
            textAlign: "center",
          }}
          id={"subTitleContainer"}
          className={"subTitleContainer"}
        >
          {sourceText?.map((item, index) => {
            return (
              <Box id={`sub_${index}`}>
                <Box
                  display="flex"
                  padding="10px 0 0 20px"
                  width={"95%"}
                  justifyContent="center"
                  alignItems={"center"}
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
                    onSplitClick={onSplitClick}
                    showPopOver={showPopOver}
                    showSplit={true}
                  />

                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.end_time}
                    index={index}
                    type={"endTime"}
                  />
                </Box>

                <CardContent
                  sx={{
                    padding: "5px 0",
                    borderBottom: 2,
                    alignItems: "center",
                  }}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
                        player.currentTime = item.startTime + 0.001;
                      }
                    }
                  }}
                >
                  {taskData?.src_language !== "en" && enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index);
                      }}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      containerStyles={{
                        width: "90%",
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200)
                      }
                      renderComponent={(props) => (
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <textarea
                            className={`${classes.customTextarea} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={4}
                            onMouseUp={(e) => onMouseUp(e, index)}
                            onBlur={() =>
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200)
                            }
                            style={{ fontSize: fontSize, height: "120px" }}
                            {...props}
                          />
                          <span
                            id="charNum"
                            style={{
                              background: "white",
                              color: "green",
                              fontWeight: 700,
                              height: "20px",
                              width: "30px",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: "-10px",
                              right: "-25px",
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
                      }}
                    >
                      <textarea
                        onChange={(event) => {
                          changeTranscriptHandler(event.target.value, index);
                        }}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        value={item.text}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        className={`${classes.customTextarea} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        style={{
                          width: "90%",
                          fontSize: fontSize,
                          height: "120px",
                        }}
                        rows={4}
                        onBlur={() =>
                          setTimeout(() => {
                            setShowPopOver(false);
                          }, 200)
                        }
                      />
                      <span
                        id="charNum"
                        style={{
                          background: "white",
                          color: "green",
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
            submit={() => saveTranscriptHandler(true, true)}
            message={"Do you want to submit the transcript?"}
            loading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default memo(RightPanel);
// TranslationRightPanel

import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CardContent,
  Grid,
  Typography,
  Switch,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox
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
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Sub from "../../../utils/Sub";
import DT from "duration-time-conversion";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmDialog from "../../../common/ConfirmDialog";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from '@mui/icons-material/Settings';

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

  const [showPopOver, setShowPopOver] = useState(false);
  const [sourceText, setSourceText] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(true);
  const [anchorElSettings, setAnchorElSettings] = useState(null)
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [anchorEle, setAnchorEle] = useState(null);
  const [anchorPos, setAnchorPos] = useState({
    positionX: 0,
    positionY: 0,
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [fontSize, setFontSize] = useState("large");

  const newSub = useCallback((item) => new Sub(item), []);

  const formatSub = useCallback(
    (sub) => {
      if (Array.isArray(sub)) {
        return sub.map((item) => newSub(item));
      }
      return newSub(sub);
    },
    [newSub]
  );

  const hasSub = useCallback((sub) => subtitles.indexOf(sub), [subtitles]);

  const copySubs = useCallback(
    () => formatSub(subtitles),
    [subtitles, formatSub]
  );

  const onDelete = (index) => {
    const copySub = copySubs();
    copySub.splice(index, 1);
    dispatch(setSubtitles(copySub, C.SUBTITLES));
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null)
  }

  const onMergeClick = (item, index) => {
    const existingsourceData = copySubs();

    existingsourceData.splice(
      index,
      2,
      newSub({
        start_time: existingsourceData[index].start_time,
        end_time: existingsourceData[index + 1].end_time,
        text: `${existingsourceData[index].text} ${
          existingsourceData[index + 1].text
        }`,
        target_text: `${existingsourceData[index].target_text} ${
          existingsourceData[index + 1].target_text
        }`,
      })
    );

    dispatch(setSubtitles(existingsourceData, C.SUBTITLES));
    setSourceText(existingsourceData);
    saveTranscriptHandler(false, true, existingsourceData);
  };

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value.length) {
      e.preventDefault();
      setAnchorPos({
        positionX: e.clientX,
        positionY: e.clientY,
      });
      setShowPopOver(true);
      setAnchorEle(e.currentTarget);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  useEffect(()=>{
    const subtitleScrollEle = document.getElementById("subtitleContainerTranslation");
    subtitleScrollEle.querySelector(`#sub_${currentIndex}`)?.scrollIntoView(true, { block: "start" });
  }, [currentIndex])

  const onReplacementDone = (updatedSource) => {
    setSourceText(updatedSource);
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
    setSourceText(arr);
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

  const onSplitClick = () => {
    const copySub = [...sourceText];

    const targetTextBlock = sourceText[currentIndexToSplitTextBlock];
    const index = hasSub(subtitles[currentIndexToSplitTextBlock]);

    const text1 = targetTextBlock.text.slice(0, selectionStart).trim();
    const text2 = targetTextBlock.text.slice(selectionStart).trim();

    if (!text1 || !text2) return;

    const splitDuration = (
      targetTextBlock.duration *
      (selectionStart / targetTextBlock.text.length)
    ).toFixed(3);

    if (splitDuration < 0.2 || targetTextBlock.duration - splitDuration < 0.2)
      return;

    copySub.splice(currentIndexToSplitTextBlock, 1);
    const middleTime = DT.d2t(
      targetTextBlock.startTime + parseFloat(splitDuration)
    );

    copySub.splice(
      index,
      0,
      newSub({
        start_time: subtitles[currentIndexToSplitTextBlock].start_time,
        end_time: middleTime,
        text: text1,
      })
    );

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime,
        end_time: subtitles[currentIndexToSplitTextBlock].end_time,
        text: text2,
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
    saveTranscriptHandler(false, true, copySub);
  };

  const handleTimeChange = (value, index, type, time) => {
    const copySub = [...sourceText];

    if (type === "startTime") {
      copySub[index].start_time = getUpdatedTime(
        value,
        time,
        copySub[index].start_time
      );
    } else {
      copySub[index].end_time = getUpdatedTime(
        value,
        time,
        copySub[index].start_time
      );
    }

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
  };

  const addNewSubtitleBox = (index) => {
    const copySub = copySubs();

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: copySub[index].end_time,
        end_time:
          index < sourceText.length - 1
            ? copySub[index + 1].start_time
            : copySub[index].end_time,
        text: "SUB_TEXT",
        target_text: "SUB_TEXT",
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
  };

  const fontMenu = [
    {
      label: "small",
      size: "small",
    },
    {
      label: "Normal",
      size: "large",
    },
    {
      label: "Large",
      size: "x-large",
    },
    {
      size: "xx-large",
      label: "Huge",
    },
  ];

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
          {/* <Grid display={"flex"} alignItems={"center"}>
            <Typography>Transliteration</Typography>
            <Switch
              checked={enableTransliteration}
              onChange={() => setTransliteration(!enableTransliteration)}
            />
          </Grid> */}
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
                  control={<Checkbox checked={enableTransliteration} onChange={() => {
                    handleCloseSettingsMenu()
                    setTransliteration(!enableTransliteration)
                  }} />}
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  label="RTL Typing"
                  control={<Checkbox checked={enableRTL_Typing} onChange={() => {
                    handleCloseSettingsMenu()
                    setRTL_Typing(!enableRTL_Typing)
                  }} />}
                />
              </MenuItem>
            </Menu>
          </>

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
            // color: "white",
            marginTop: "5px",
          }}
          id={"subtitleContainerTranslation"}
          className={"subTitleContainer"}
        >
          {sourceText?.map((item, index) => {
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

                  {/* <Tooltip title="Split Subtitle" placement="bottom">
                    <IconButton
                      sx={{
                        backgroundColor: "#0083e2",
                        borderRadius: "50%",
                        marginRight: "10px",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#271e4f",
                        },
                        "&:disabled": {
                          background: "grey",
                        },
                      }}
                      onClick={onSplitClick}
                      disabled={!showPopOver}
                    >
                      <SplitscreenIcon />
                    </IconButton>
                  </Tooltip> */}

                  {index < sourceText.length - 1 && (
                    <Tooltip title="Merge Next" placement="bottom">
                      <IconButton
                        sx={{
                          backgroundColor: "#0083e2",
                          borderRadius: "50%",
                          marginRight: "10px",
                          color: "#fff",
                          transform: "rotate(180deg)",
                          "&:hover": {
                            backgroundColor: "#271e4f",
                          },
                        }}
                        onClick={() => onMergeClick(item, index)}
                      >
                        <MergeIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Delete" placement="bottom">
                    <IconButton
                      color="error"
                      sx={{
                        backgroundColor: "red",
                        borderRadius: "50%",
                        color: "#fff",
                        marginRight: "10px",
                        "&:hover": {
                          backgroundColor: "#271e4f",
                        },
                      }}
                      onClick={() => onDelete(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Add Subtitle Box" placement="bottom">
                    <IconButton
                      sx={{
                        backgroundColor: "#0083e2",
                        borderRadius: "50%",
                        color: "#fff",
                        marginRight: "10px",
                        "&:hover": {
                          backgroundColor: "#271e4f",
                        },
                      }}
                      onClick={() => addNewSubtitleBox(index)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>

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
                  <textarea
                    rows={4}
                    className={`${classes.textAreaTransliteration} ${
                      currentIndex === index ? classes.boxHighlight : ""
                    }`}
                    dir={enableRTL_Typing ? "rtl" : "ltr"}
                    style={{ fontSize: fontSize, height: "100px" }}
                    value={item.text}
                    onMouseUp={(e) => onMouseUp(e, index)}
                    onBlur={() =>
                      setTimeout(() => {
                        setShowPopOver(false);
                      }, 200)
                    }
                    onChange={(event) => {
                      changeTranscriptHandler(
                        event.target.value,
                        index,
                        "transcript"
                      );
                    }}
                  />
                  {enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.target_language}
                      value={item.target_text}
                      // onChangeText={(text, index) => {}}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index, "transaltion");
                      }}
                      onFocus={(e) => onMouseUp(e, index)}
                      containerStyles={{
                        width: "100%",
                      }}
                      style={{ fontSize: fontSize, height: "100px" }}
                      renderComponent={(props) => (
                        <textarea
                          className={`${classes.textAreaTransliteration} ${
                            currentIndex === index ? classes.boxHighlight : ""
                          }`}
                          dir={enableRTL_Typing ? "rtl" : "ltr"}
                          rows={4}
                          onBlur={() =>
                            setTimeout(() => {
                              setShowPopOver(false);
                            }, 200)
                          }
                          {...props}
                        />
                      )}
                    />
                  ) : (
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
                      onMouseUp={(e) => onMouseUp(e, index)}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200)
                      }
                      value={item.target_text}
                    />
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

export default TranslationRightPanel;

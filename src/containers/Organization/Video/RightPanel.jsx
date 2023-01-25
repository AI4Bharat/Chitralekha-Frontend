import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  TextField,
  CardContent,
  Grid,
  Typography,
  Switch,
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
import DT from "duration-time-conversion";
import Sub from "../../../utils/Sub";
import MergeIcon from "@mui/icons-material/Merge";
import { getUpdatedTime } from "../../../utils/utils";
import TimeBoxes from "../../../common/TimeBoxes";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import ConfirmDialog from "../../../common/ConfirmDialog";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";

const RightPanel = ({ currentIndex, player }) => {
  const { taskId } = useParams();
  const classes = ProjectStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
  const subtitles = useSelector((state) => state.commonReducer.subtitles);

  const newSub = useCallback((item) => new Sub(item), []);
  const [sourceText, setSourceText] = useState([]);

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

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [showPopOver, setShowPopOver] = useState(false);

  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [anchorEle, setAnchorEle] = useState(null);
  const [anchorPos, setAnchorPos] = useState({
    positionX: 0,
    positionY: 0,
  });
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [showSplitButton, setShowSplitButton] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [fontSize, setFontSize] = useState("large");
  const [anchorElSettings, setAnchorElSettings] = useState(null);

  useEffect(() => {
    if (subtitles?.length === 0){
      const defaultSubs = [newSub({
        start_time: '00:00:00.000',
        end_time: '00:00:00.000',
        text: "Please type here..",
      })]
      dispatch(setSubtitles(defaultSubs, C.SUBTITLES))
    }
    else
      setSourceText(subtitles);
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

  const onMergeClick = (item, index) => {
    const existingsourceData = [...sourceText];
    const newItemObj = existingsourceData[index];

    newItemObj["end_time"] = existingsourceData[index + 1]["end_time"];

    newItemObj["text"] =
      newItemObj["text"] + " " + existingsourceData[index + 1]["text"];

    existingsourceData[index] = newItemObj;
    existingsourceData.splice(index + 1, 1);

    dispatch(setSubtitles(existingsourceData, C.SUBTITLES));
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

  const onSplitClick = () => {
    const copySub = copySubs();

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
    saveTranscriptHandler(false, true, copySub);
  };

  const onReplacementDone = (updatedSource) => {
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    saveTranscriptHandler(false, true);
  };

  const changeTranscriptHandler = (text, index) => {
    const arr = [...sourceText];
    arr.forEach((element, i) => {
      if (index === i) {
        element.text = text;
      }
    });

    dispatch(setSubtitles(arr, C.SUBTITLES));
    saveTranscriptHandler(false, false);
  };

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
  };

  const onDelete = (index) => {
    const copySub = [...sourceText];
    copySub.splice(index, 1);
    dispatch(setSubtitles(copySub, C.SUBTITLES));
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
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
  };

  const targetLength = (index) => {
    if (sourceText[index]?.text.trim() !== "")
      return sourceText[index]?.text.trim().split(" ").length;
    return 0;
  };

  useEffect(() => {
    if (sourceText?.length ===  0)
      setSourceText([newSub({
        start_time: '00:00:00.000',
        end_time: '00:00:05.000',
        text: "Please type here..",
      })])
  }, [sourceText, newSub])

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

                  <Tooltip title="Split Subtitle" placement="bottom">
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
                  </Tooltip>

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
                      <MenuItem
                        key={index}
                        onClick={() => setFontSize(item.size)}
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
                      onFocus={(e) => onMouseUp(e, index)}
                      containerStyles={{
                        width: "90%",
                      }}
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

export default RightPanel;

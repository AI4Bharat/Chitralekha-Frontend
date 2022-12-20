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
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useNavigate, useParams } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import FindAndReplace from "../../../common/FindAndReplace";
import { setSubtitles } from "../../../redux/actions/Common";
import C from "../../../redux/constants";
import SplitPopOver from "../../../common/SplitPopOver";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DT from "duration-time-conversion";
import Sub from "../../../utils/Sub";
import MergeIcon from "@mui/icons-material/Merge";

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
  const [anchorEle, setAnchorEle] = useState(null);
  const [anchorPos, setAnchorPos] = useState({
    positionX: 0,
    positionY: 0,
  });
  const [enableTransliteration, setTransliteration] = useState(true);
  const [showSplitButton, setShowSplitButton] = useState(false);

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  const onMergeClick = (item, index) => {
    const existingsourceData = [...sourceText];
    const newItemObj = existingsourceData[index];

    newItemObj["end_time"] = existingsourceData[index + 1]["end_time"];

    newItemObj["text"] =
      newItemObj["text"] + " " + existingsourceData[index + 1]["text"];

    existingsourceData[index] = newItemObj;
    existingsourceData.splice(index + 1, 1);

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

  const onSplitClick = () => {
    setShowPopOver(false);
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
    setSourceText(copySub);
    saveTranscriptHandler(false, true, copySub);
  };

  const onReplacementDone = (updatedSource) => {
    setSourceText(updatedSource);
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
    setSourceText(arr);
    saveTranscriptHandler(false, false);
  };

  const saveTranscriptHandler = async (
    isFinal,
    isAutosave,
    payload = sourceText
  ) => {
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
    //dispatch(APITransport(obj));
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
      if (isFinal) {
        setTimeout(() => {
          navigate(
            `/my-organization/${assignedOrgId}/project/${taskData?.project}`
          );
        }, 2000);
      }
      //navigate(`/my-organization/:orgId/project/:projectId`)
    } else {
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

  const handleTimeChange = (value, index, type) => {
    const copySub = [...sourceText];

    if (type === "startTime") {
      copySub[index].start_time = value;
    } else {
      copySub[index].end_time = value;
    }

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
  };

  const onDelete = (index) => {
    const copySub = [...sourceText];
    copySub.splice(index, 1);
    dispatch(setSubtitles(copySub, C.SUBTITLES));
  };

  return (
    <>
      {renderSnackBar()}
      <Box
        sx={{
          display: "flex",
          border: fullscreen ? "" : "1px solid #eaeaea",
        }}
        flexDirection="column"
      >
        <Grid display={"flex"} direction={"row"} flexWrap={"wrap"}>
          <FindAndReplace
            sourceData={sourceText}
            subtitleDataKey={"text"}
            onReplacementDone={onReplacementDone}
            enableTransliteration={enableTransliteration}
            transliterationLang={taskData?.src_language}
          />
          <Button
            variant="contained"
            className={classes.findBtn}
            onClick={() => saveTranscriptHandler(false, true)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            className={classes.findBtn}
            onClick={() => saveTranscriptHandler(true, true)}
          >
            Complete
          </Button>
          <Box display={"flex"} alignItems={"center"} paddingX={2}>
            <Typography variant="subtitle2">Transliteration</Typography>
            <Switch
              checked={enableTransliteration}
              onChange={() => setTransliteration(!enableTransliteration)}
            />
          </Box>
          {/* <Box display={"flex"} alignItems={"center"} paddingX={2}>
            <Typography variant="subtitle2">Split</Typography>
            <Switch
              checked={showSplitButton}
              onChange={() => setShowSplitButton(!showSplitButton)}
            />
          </Box> */}
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #eaeaea",
            overflowY: "scroll",
            overflowX: "hidden",
            height: window.innerHeight * 0.63,
            backgroundColor: "black",
            // color: "white",
            marginTop: "5px",
            width: "100%",
            textAlign: "center",
          }}
          className={"subTitleContainer"}
        >
          {sourceText?.map((item, index) => {
            return (
              <>
                <Box
                  display="flex"
                  padding="10px 0 0 20px"
                  width={"95%"}
                  justifyContent="center"
                  alignItems={"center"}
                >
                  <TextField
                    variant="outlined"
                    type="time"
                    value={item.start_time}
                    onChange={(event) =>
                      handleTimeChange(event.target.value, index, "startTime")
                    }
                    inputProps={{ step: 1 }}
                    sx={{
                      width: "25%",
                      marginRight: "auto",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#616A6B  ",
                        color: "white",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "12px",
                        padding: "7px 14px",
                        textAlign: "center",
                      },
                      '& input[type="time"]::-webkit-calendar-picker-indicator':
                      {
                        color: "#fff",
                      },
                    }}
                  />

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
                        "&:hover": {
                          backgroundColor: "#271e4f",
                        },
                      }}
                      onClick={() => onDelete(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>

                  <TextField
                    variant="outlined"
                    type="time"
                    value={item.end_time}
                    onChange={(event) =>
                      handleTimeChange(event.target.value, index, "endTime")
                    }
                    sx={{
                      marginLeft: "auto",
                      width: "25%",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#616A6B",
                        color: "white",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "12px",
                        padding: "7px 14px",
                        textAlign: "center",
                      },
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    padding: "5px 0",
                    borderBottom: 2,
                    alignItems: "center",
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
                      renderComponent={(props) => (
                        <textarea
                          className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
                            }`}
                          rows={4}
                          {...props}
                        />
                      )}
                    />
                  ) : (
                    <textarea
                      onChange={(event) => {
                        changeTranscriptHandler(event.target.value, index);
                      }}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      value={item.text}
                      className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
                        }`}
                      rows={4}
                    />
                  )}
                </CardContent>
              </>
            );
          })}
          <SplitPopOver
            open={showPopOver}
            handleClosePopOver={() => {
              setShowPopOver(false);
            }}
            anchorEl={anchorEle}
            anchorPosition={anchorPos}
            onSplitClick={onSplitClick}
          />
        </Box>
      </Box>
    </>
  );
};

export default RightPanel;

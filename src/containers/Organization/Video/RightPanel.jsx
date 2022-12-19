import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  TextField,
  CardContent,
  Grid,
  Typography,
  Switch,
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

  const [sourceText, setSourceText] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [showPopOver, setShowPopOver] = useState(false);
  const [enableTransliteration, setTransliteration] = useState(true);

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  const onMergeClick = (item, index) => {
    const existingsourceData = [...sourceText];
    const newItemObj = existingsourceData[index];

    newItemObj["end_time"] = existingsourceData[index + 1]["end_time"];
    newItemObj["text"] =
      newItemObj["text"] + existingsourceData[index + 1]["text"];

    existingsourceData[index] = newItemObj;
    existingsourceData.splice(index + 1, 1);

    dispatch(setSubtitles(existingsourceData, C.SUBTITLES));
    setSourceText(existingsourceData);
    saveTranscriptHandler(false, true, existingsourceData);
  };

  const onMouseUp = (e) => {
    // setShowPopOver(true)
    // e.preventDefault();
    // console.log("event ---- ", e);
    // console.log("selection start --- ", e.target.selectionStart);
    // console.log("text length --- ", e.target.value.length);
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
          {/* <Button variant="contained" className={classes.findBtn}>
          Find/Search
        </Button> */}
          <FindAndReplace
            sourceData={sourceText}
            subtitleDataKey={"text"}
            onReplacementDone={onReplacementDone}
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
          <Grid display={"flex"} alignItems={"center"} paddingX={2}>
            <Typography>Transliteration</Typography>
            <Switch
              checked={enableTransliteration}
              onChange={() => setTransliteration(!enableTransliteration)}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #eaeaea",
            overflowY: "scroll",
            overflowX: "hidden",
            height: window.innerHeight * 0.665,
            backgroundColor: "black",
            color: "white",
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
                  padding="10px 0px 0"
                  width={"100%"}
                  justifyContent="space-around"
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

                  <TextField
                    variant="outlined"
                    type="time"
                    value={item.end_time}
                    onChange={(event) =>
                      handleTimeChange(event.target.value, index, "endTime")
                    }
                    sx={{
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
                  sx={{ paddingX: 0, borderBottom: 2, alignItems: "center" }}
                >
                  {taskData?.src_language !== "en" && enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index);
                      }}
                      onMouseUp={onMouseUp}
                      containerStyles={{
                        width: "100%",
                      }}
                      renderComponent={(props) => (
                        <textarea
                          className={`${classes.customTextarea} ${
                            currentIndex === index ? classes.boxHighlight : ""
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
                      onMouseUp={onMouseUp}
                      value={item.text}
                      className={`${classes.customTextarea} ${
                        currentIndex === index ? classes.boxHighlight : ""
                      }`}
                      rows={4}
                    />
                  )}
                  <Grid display={"flex"} justifyContent={"space-around"}>
                    {index < sourceText.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={() => onMergeClick(item, index)}
                      >
                        Merge Next
                      </Button>
                    )}
                  </Grid>
                </CardContent>
              </>
            );
          })}
          <SplitPopOver
            open={showPopOver}
            handleClosePopOver={() => {
              setShowPopOver(false);
            }}
            // anchorEl={}
          />
        </Box>
      </Box>
    </>
  );
};

export default RightPanel;

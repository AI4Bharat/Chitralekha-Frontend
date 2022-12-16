import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, CardContent } from "@mui/material";
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

const RightPanel = ({ currentIndex }) => {
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

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  const onReplacementDone = (updatedSource) => {
    setSourceText(updatedSource);
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    saveTranscriptHandler(false, true);
  }

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
        message: resp?.message ? resp?.message : isAutosave ? "Saved as draft" : "",
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
        <Box display="flex">
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
        </Box>
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
            textAlign: "center"
          }}
          className={"subTitleContainer"}
        >
          {sourceText?.map((item, index) => {
            return (
              <>
                <Box display="flex" padding="10px 0px 0" width={"100%"} justifyContent="center" >
                  <TextField
                    variant="outlined"
                    value={item.start_time}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        width: "85%",
                        backgroundColor: "#616A6B  ",
                        color: "white",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "12px",
                        padding: "7px 14px",
                        textAlign: "center",
                      },
                    }}
                  />

                  <TextField
                    variant="outlined"
                    value={item.end_time}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        width: "85%",
                        marginLeft: "auto",
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
                  sx={{ display: "flex", paddingX: 0, borderBottom: 2, alignItems: "center" }}
                >
                  {taskData?.src_language === "en" ?
                    <textarea
                      onChange={(event) => {
                        changeTranscriptHandler(event.target.value, index);
                      }}
                      value={item.text}
                      className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
                        }`}
                      rows={4}
                    />
                    : <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index);
                      }}
                      containerStyles={{
                        width: "100%",
                      }}
                      renderComponent={(props) => (
                        <textarea
                          className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
                            }`}
                          rows={4}
                          {...props}
                        />
                      )}
                    />}
                </CardContent>
              </>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default RightPanel;

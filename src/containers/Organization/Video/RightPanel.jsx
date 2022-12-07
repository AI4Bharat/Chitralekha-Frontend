import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, CardContent, } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";

const RightPanel = () => {
  const { taskId } = useParams();
  const classes = ProjectStyle();
  const dispatch = useDispatch();

  const transcriptPayload = useSelector((state) => state.getTranscriptPayload.data);
  
  const [sourceText, setSourceText] = useState([]);
  const [lang, setLang] = useState("hi");

  useEffect(() => {
    setSourceText(transcriptPayload?.payload?.payload)
  }, [transcriptPayload?.payload?.payload]);

  const changeTranscriptHandler = (target, index) => {
    const arr = [...sourceText];
    arr.forEach((element, i) => {
      if(index === i) {
        element.text = target.value
      }
    });

    setSourceText(arr);
    saveTranscriptHandler(false)
  }

  const saveTranscriptHandler = (isFinal) => {
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: sourceText
      }
    };

    if(isFinal){
      reqBody.final = true
    }

    const obj = new SaveTranscriptAPI(reqBody);
    dispatch(APITransport(obj));
  }

  return (
    <Box
      sx={{
        display: "flex",
        borderLeft: "1px solid #eaeaea",
      }}
      width="25%"
      flexDirection="column"
    >
      <Box display="flex">
        <Button variant="contained" className={classes.findBtn}>
          Find/Search
        </Button>
        <Button variant="contained" className={classes.findBtn} onClick={() => saveTranscriptHandler(true)}>
          Save
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #eaeaea",
          overflowY: "scroll",
          height: "100%"
        }}
      >
        {
          sourceText?.map((item, index) => {
            return (<>
              <Box display="flex" padding="10px 24px 0">
                <TextField variant="outlined" value={item.start_time} sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "85%"
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "12px",
                    padding: "7px 14px",
                  }
                }}/>

                <TextField variant="outlined" value={item.end_time} sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "85%",
                    marginLeft: "auto",
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "12px",
                    padding: "7px 14px",
                  }
                }}/>
              </Box>
              {/* <IndicTransliterate
                lang={"hi"}
                value={item.text}
                onChangeText={(text, index) => {
                }}
                onChange={(event) => {
                  changeTranscriptHandler(event.target, index)
                }}
                renderComponent={(props) => (
                  <textarea className={classes.customTextarea} rows={3} {...props} />
                )}
              /> */}
              <CardContent>
              <textarea rows={3} className={classes.textAreaTransliteration}
              value={item.text} 
               onChange={(event) => {
                changeTranscriptHandler(event.target, index)
              }}
               />
               </CardContent>
            </>)
          })
        }
      </Box>
    </Box>
  );
};

export default RightPanel;

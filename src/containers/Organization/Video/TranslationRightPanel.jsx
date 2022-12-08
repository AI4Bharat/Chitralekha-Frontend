// TranslationRightPanel

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, CardContent, Divider, } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";

const TranslationRightPanel = () => {
  const { taskId } = useParams();
  const classes = ProjectStyle();
  const dispatch = useDispatch();

  const transcriptPayload = useSelector((state) => state.getTranscriptPayload.data);
  const taskData = useSelector((state)=>state.getTaskDetails.data);
  
  const [sourceText, setSourceText] = useState([]);
  const [lang, setLang] = useState("hi");
 
 

  useEffect(() => {
    setSourceText(transcriptPayload?.payload?.payload)
  }, [transcriptPayload?.payload?.payload]);

  const changeTranscriptHandler = (target, index) => {
    const arr = [...sourceText];
    arr.forEach((element, i) => {
      if(index === i) {
        element.target_text = target.value
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

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
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
          height: "100%",
          backgroundColor:"black",
          color:"white",
        }}
      >
        {
          sourceText?.map((item, index) => {
            return (<>
              <Box display="flex" padding="16px" sx={{paddingX: 0, justifyContent: "space-around"}} >
                <TextField variant="outlined" value={item.start_time} sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "85%",
                    backgroundColor:"#616A6B  ",
                    color:"white"
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
                    backgroundColor:"#616A6B",
                    color:"white"
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
              <CardContent sx={{display: "flex", paddingX: 0, borderBottom: 2}}>
              <textarea rows={4} 
              className={classes.textAreaTransliteration}
              contentEditable={false}
              //   className={({ isActive }) =>
              //   isActive ? classes.textAreaTransliteration : classes.headerMenu
              // }
              // activeClassName={classes.textAreaTransliteration}
              defaultValue={item.text} 
            //    onChange={(event) => {
            //     changeTranscriptHandler(event.target, index)
                
            //   }}
               />
               <textarea rows={4} 
              className={classes.textAreaTransliteration}
              //   className={({ isActive }) =>
              //   isActive ? classes.textAreaTransliteration : classes.headerMenu
              // }
              // activeClassName={classes.textAreaTransliteration}
              value={item.target_text} 
               onChange={(event) => {
                changeTranscriptHandler(event.target, index)
                
              }}
               />
               </CardContent>
               {/* <CardContent>
              
               </CardContent> */}
            </>)
          })
        }
      </Box>
    </Box>
  );
};

export default TranslationRightPanel;

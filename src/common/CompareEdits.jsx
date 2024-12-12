import {
  Dialog,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";
import '../styles/Compare.css'; 
import React, { useCallback, useEffect, useState,useRef} from "react";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { FetchpreviewTaskAPI, setSnackBar } from "redux/actions";
import { useDispatch } from "react-redux";
import Loader from "./Spinner";
import TimeBoxes from "./TimeBoxes";
import DiffViewer,{DiffMethod} from "react-diff-viewer";
import { diffWords } from "diff";
import Compare from "redux/actions/api/Project/Compare";
import Comparetrans from "redux/actions/api/Project/CompareTrans";

const CompareEdits = ({
  openPreviewDialog,
  handleClose,
  videoId,
  taskType,
  currentSubs,
  targetLanguage,
}) => {
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [EditCompleteTexts, setEditCompleteTexts] = useState();
  const [SelectSourceTexts,setSelectSourceTexts] = useState();
  const [loading, setLoading] = useState(false);
  const [totalAdded, setTotalAdded] = useState(0);
  const [totalDeleted, setTotalDeleted] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [selectedDiffMethod, setSelectedDiffMethod] = useState(DiffMethod.WORDS);

  const handleDiffMethodChange = (event) => {
    setSelectedDiffMethod(event.target.value);
  };

  const dialogRef = useRef(null);

  // const selectSource = [
  //   "What he wants, that conversation is very interesting for a couple of reasons.",
  //   "Power.",
  //   "So, Muni thinks that a conversation endorses the viewpoint of the shopkeeper.",
  // ];

  // const editComplete = [
  //   "Though that narrative is unsuccessful in getting him what he wants, that conversation is very interesting for a couple of reasons.",
  //   "123 Power.",
  //   "Muni thinks that a conversation endorses the viewpoint of the shopkeeper will make him happy.",
  // ];




  const fetchPreviewData = useCallback(async () => {
    setLoading(true)
    console.log(targetLanguage);
    
    if(taskType=="TRANSCRIPTION_EDIT"){
      
      var taskObj = new Compare(videoId);

    }else{

      var taskObj = new Comparetrans(videoId);
    }
    try {
      const res = await fetch(taskObj.apiEndPoint(), {
        method: "GET",
        headers: taskObj.getHeaders().headers,
      });

      const data = await res.json();
      console.log(data);
       if(taskType=="TRANSCRIPTION_EDIT"){ 
      if (data?.transcripts) {
          const editComplete = [];
          const selectSource = [];
          console.log(data);
          
          data.transcripts.forEach((transcript) => {
            if (transcript.status === "TRANSCRIPTION_EDIT_COMPLETE") {
              editComplete.push(
                ...transcript.data.payload.map((item) => item.verbatim_text)
              );
            } else if (transcript.status === "TRANSCRIPTION_SELECT_SOURCE") {
              selectSource.push(
                ...transcript.data.payload.map((item) => item.text)
              );
            }
          });
          console.log(editComplete,selectSource);
          
          setEditCompleteTexts(editComplete);
          setSelectSourceTexts(selectSource);
        }
      }else{
        if (data) {
          const editComplete = [];
          const selectSource = [];
          
          data.forEach((translate) => {

            if (translate.status === "TRANSLATION_EDIT_COMPLETE" && targetLanguage == translate.target_language) {
              editComplete.push(
                ...translate.data.payload.map((item) => item.target_text)
              );
            } else if (translate.status === "TRANSLATION_SELECT_SOURCE" && targetLanguage== translate.target_language) {
              selectSource.push(
                ...translate.data.payload.map((item) => item.target_text )
              );
            }
          });
          console.log(editComplete,selectSource);
          
          setEditCompleteTexts(editComplete);
          setSelectSourceTexts(selectSource);
        }

      }
        setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [ dispatch,videoId]);

  useEffect(() => {
    if (openPreviewDialog) {
      fetchPreviewData();
    }
  }, [fetchPreviewData, openPreviewDialog]);

 


  const calculateWordDiff = (sourceText, editedText) => {
    const diff = diffWords(sourceText, editedText);
    let addedWords = 0;
    let deletedWords = 0;

    diff.forEach((part) => {
      if (part.added) {
        addedWords += part.value.split(/\s+/).filter(Boolean).length;
      }
      if (part.removed) {
        deletedWords += part.value.split(/\s+/).filter(Boolean).length;
      }
    });

    return { addedWords, deletedWords };
  };

  useEffect(() => {
    if (openPreviewDialog) {
      let added = 0;
      let deleted = 0;

      SelectSourceTexts?.forEach((sourceText, index) => {
        const { addedWords, deletedWords } = calculateWordDiff(
          sourceText,
          EditCompleteTexts[index] || ""
        );
        added += addedWords;
        deleted += deletedWords;
      });

      setTotalAdded(added);
      setTotalDeleted(deleted);
      setRatio((deleted / (added || 1)).toFixed(2)); 
    }
  }, [openPreviewDialog, SelectSourceTexts, EditCompleteTexts]);

  const handleFullscreenToggle = () => {
    const elem = dialogRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

 

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
      <Dialog
      open={openPreviewDialog}
      onClose={handleClose}
      ref={dialogRef}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ 
        style: { 
          borderRadius: "10px", 
          width: isFullscreen ? '100%' : 'auto',
          height: isFullscreen ? '100%' : 'auto',
          margin: 0,
          maxWidth: isFullscreen ? '100%' : '600px',
        } 
      }}
      fullScreen={isFullscreen}

    >
      <DialogTitle variant="h4" display="flex" alignItems={"center"}>
        <Typography variant="h4" flexGrow={1}>Source vs Edit Comparison</Typography>{" "}
        <IconButton
          aria-label="fullscreen"
          onClick={handleFullscreenToggle}
          sx={{ marginLeft: "auto" }}
        >
         {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>


      <DialogContent  sx={{ height: "410px", zIndex:"4" }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="diffMethod" style={{ marginRight: '10px' }}>
          Select Comparison Method:
        </label>
        <select
          id="diffMethod"
          value={selectedDiffMethod}
          onChange={handleDiffMethodChange}
          style={{
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <option value={DiffMethod.CHARS}>Characters</option>
          <option value={DiffMethod.WORDS}>Words</option>
          <option value={DiffMethod.WORDS_WITH_SPACE}>Words with Space</option>
          <option value={DiffMethod.LINES}>Lines</option>
          <option value={DiffMethod.TRIMMED_LINES}>Trimmed Lines</option>
          <option value={DiffMethod.SENTENCES}>Sentences</option>
        </select>
      </div>

        {loading ? (
           <div style={{
            position: 'absolute',
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 1, 
          }}>
            <CircularProgress />
            </div>
        ) : (

        <DialogContentText id="alert-dialog-description">
    <div className="transcription-panels">
      {SelectSourceTexts?.map((sourceText, index) => {
    const editedText = EditCompleteTexts[index] || "";
    const hasDifferences = sourceText !== editedText;

    return (
      <div
        key={index}
        className="diff-container"
      >
        <h5 style={{margin:"0"}}>Card - {index + 1}</h5>
        {hasDifferences ? (
          <DiffViewer
            oldValue={sourceText}
            newValue={editedText}
            splitView={true}
            hideLineNumbers
            compareMethod={selectedDiffMethod}
            styles={{
              variables: {
                addedBackground: "rgba(0, 255, 0, 0.2)",
                removedBackground: "rgba(255, 0, 0, 0.2)",
              },
            }}
          />
        ) : (
          <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, whiteSpace: "pre-wrap" ,backgroundColor:"#DDDDDD",padding:"10px"}}>
            <div>{sourceText || "No Source Text"}</div>
          </div>
          <div style={{ flex: 1, whiteSpace: "pre-wrap",backgroundColor:"#EEEEEE",padding:"10px" }}>
            <div>{EditCompleteTexts[index] || "No Edited Text"}</div>
          </div>
        </div>
    
        )}
      </div>
    );
  })}


      <div className="footer" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}>
        <div style={{ flex: 1, whiteSpace: "pre-wrap" ,padding:"10px"}}>
          Total Changes: <span className="add-count" style={{color:"green"}}>{totalAdded}</span>
        </div>
        <div style={{ flex: 1, whiteSpace: "pre-wrap" ,padding:"10px"}}>
          Total Deletions: <span className="del-count" style={{color:"red"}}>{totalDeleted}</span>
        </div>
      </div>
    </div>

    </DialogContentText>
        )}
      </DialogContent>
    </Dialog>
    );
};

export default CompareEdits;

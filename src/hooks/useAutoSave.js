import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { APITransport, SaveTranscriptAPI } from "redux/actions";

export const useAutoSave = () => {
  const { taskId } = useParams();
  const saveIntervalRef = useRef(null);
  const dispatch = useDispatch();
  
  // Add session time tracking
  const [sessionStartTime, setSessionStartTime] = useState(new Date().toISOString());

  const limit = useSelector((state) => state.commonReducer.limit);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const subs = useSelector((state) => state.commonReducer.subtitles);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const [apiInProgress, setApiInProgress] = useState(false);
  const apiInProgressRef = useRef(apiInProgress);
  const loggedin_user_id = JSON.parse(localStorage.getItem("userData"))?.id;
  
  useEffect(() => {
    const { progress, success, data, apiType } = apiStatus;
    setApiInProgress(progress);
    
    // Reset session time after successful autosave
    if (!progress && success && apiType === "SAVE_TRANSCRIPT") {
      setSessionStartTime(new Date().toISOString());
    }
  }, [apiStatus]);

  useEffect(() => {
    apiInProgressRef.current = apiInProgress;
  }, [apiInProgress]);
  
  useEffect(() => {
    const handleAutosave = () => {
      // Skip if API is in progress
      if (apiInProgressRef.current) {
        console.log("Skipping autosave - API in progress");
        return;
      }

      // Skip if no subtitles or user mismatch
      if (!subs || subs.length === 0 || !taskDetails?.user?.id || !loggedin_user_id || loggedin_user_id !== taskDetails?.user?.id) {
        return;
      }

      let copySubs = JSON.parse(JSON.stringify(subs));

      if(taskDetails?.task_type.includes("TRANSLATION_VOICEOVER")){
        if(copySubs.length > 0){
          copySubs.forEach(element => {
            element.audio = "";
          });
        }
      }

      const reqBody = {
        task_id: taskId,
        offset: currentPage,
        limit: limit,
        session_start: sessionStartTime, // Include session start time
        payload: {
          payload: copySubs,
        },
      };

      console.log("Auto Save API Called", {
        userId: loggedin_user_id, 
        taskUserId: taskDetails?.user?.id,
        sessionStart: sessionStartTime
      });
      
      const obj = new SaveTranscriptAPI(reqBody, taskDetails?.task_type);
      dispatch(APITransport(obj));
      
      // Note: sessionStartTime will be reset in the apiStatus useEffect above
    };

    // Set up autosave interval based on task type
    const interval = taskDetails?.task_type?.includes("TRANSLATION_VOICEOVER") 
      ? 5 * 60 * 1000  // 5 minutes for voiceover
      : 60 * 1000;     // 1 minute for others

    if (taskDetails && subs && subs.length > 0) {
      saveIntervalRef.current = setInterval(handleAutosave, interval);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible - start autosave interval
        if (taskDetails && subs && subs.length > 0) {
          clearInterval(saveIntervalRef.current);
          saveIntervalRef.current = setInterval(handleAutosave, interval);
        }
      } else {
        // Page became hidden - save immediately and stop interval
        handleAutosave();
        clearInterval(saveIntervalRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      clearInterval(saveIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [taskDetails, subs, currentPage, limit, sessionStartTime, loggedin_user_id]);

  // Reset session time when component mounts or task changes
  useEffect(() => {
    if (taskDetails?.id) {
      setSessionStartTime(new Date().toISOString());
    }
  }, [taskDetails?.id]);
};

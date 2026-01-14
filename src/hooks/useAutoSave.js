import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { APITransport, SaveTranscriptAPI } from "redux/actions";

export const useAutoSave = () => {
  const { taskId } = useParams();
  const saveIntervalRef = useRef(null);
  const dispatch = useDispatch();

  const limit = useSelector((state) => state.commonReducer.limit);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const subs = useSelector((state) => state.commonReducer.subtitles);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const [apiInProgress, setApiInProgress] = useState(false);
  const apiInProgressRef = useRef(apiInProgress);
  const userDataFromStorage = localStorage.getItem("userData");
  const loggedin_user_id = userDataFromStorage ? JSON.parse(userDataFromStorage)?.id : null;
  
  useEffect(() => {
    const { progress, success, data, apiType } = apiStatus;
    setApiInProgress(progress);
  }, [apiStatus]);

  useEffect(() => {
    apiInProgressRef.current = apiInProgress;
  }, [apiInProgress]);
  
  useEffect(() => {
    const handleAutosave = () => {
      // if (SaveTranscriptAPI.shouldSkipAutoSave) {
      //   return;
      // }

      let copySubs = JSON.parse(JSON.stringify(subs));

      if(taskDetails?.task_type.includes("TRANSLATION_VOICEOVER")){
        if(copySubs.length > 0){
          copySubs.forEach(element => {
            element.audio = "";
          });
      }}

      const reqBody = {
        task_id: taskId,
        offset: currentPage,
        limit: limit,
        payload: {
          payload: copySubs,
        },
      };

      if ( loggedin_user_id && taskDetails?.user?.id && loggedin_user_id === taskDetails?.user?.id) {
        console.log("Auto Save API Called", loggedin_user_id, taskDetails, taskDetails?.user?.id);
        const obj = new SaveTranscriptAPI(reqBody, taskDetails?.task_type);
        dispatch(APITransport(obj));
      }
    };

    if(taskDetails?.task_type?.includes("TRANSLATION_VOICEOVER")){
      saveIntervalRef.current = setInterval(handleAutosave, 5 * 60 * 1000);
    }else{
      saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if(taskDetails?.task_type?.includes("TRANSLATION_VOICEOVER")){
          saveIntervalRef.current = setInterval(handleAutosave, 5 * 60 * 1000);
        }else{
          saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
        }
      } else {
        handleAutosave();
        clearInterval(saveIntervalRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [taskDetails, subs]);
};

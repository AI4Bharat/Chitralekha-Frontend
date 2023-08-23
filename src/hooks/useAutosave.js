import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APITransport, SaveTranscriptAPI } from "redux/actions";

export const useAutosave = (
  taskId,
  currentPage,
  limit,
  taskDetails,
) => {
  const dispatch = useDispatch();
  const saveIntervalRef = useRef(null);

  const subs = useSelector((state) => state.commonReducer.subtitles);
  
  const handleAutosave = () => {
    const reqBody = {
      task_id: taskId,
      offset: currentPage,
      limit: limit,
      payload: {
        payload: subs,
      },
    };

    const obj = new SaveTranscriptAPI(reqBody, taskDetails?.task_type);
    dispatch(APITransport(obj));
  };

  useEffect(() => {
    saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);

    const handleBeforeUnload = (event) => {
      handleAutosave();
      event.preventDefault();
      event.returnValue = "";
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
      } else {
        handleAutosave();
        clearInterval(saveIntervalRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveIntervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    
    // eslint-disable-next-line
  }, [taskId, currentPage, limit, subs, taskDetails, dispatch]);
};
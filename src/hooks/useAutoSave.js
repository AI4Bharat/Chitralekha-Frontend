import { useEffect } from "react";
import { useRef } from "react";
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

  useEffect(() => {
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

    saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);

    const handleBeforeUnload = (event) => {
      handleAutosave();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
      } else {
        handleAutosave();
        clearInterval(saveIntervalRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveIntervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [subs]);
};
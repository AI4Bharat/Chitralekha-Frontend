import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { APITransportUTS, UpdateTimeSpentPerTask } from "redux/actions";

export const useUpdateTimeSpent = (ref) => {
  const { taskId } = useParams();
  const timeSpentIntervalRef = useRef(null);
  const dispatch = useDispatch();
  const taskDetails = useSelector((state) => state.getTaskDetails.data);

  useEffect(() => {
    const handleUpdateTimeSpent = (time = taskDetails?.task_type?.includes("VOICEOVER") ? 5 * 60 : 60) => {
      const apiObj = new UpdateTimeSpentPerTask(taskId, time);
      dispatch(APITransportUTS(apiObj));
    };

    timeSpentIntervalRef.current = setInterval(
      handleUpdateTimeSpent,
      taskDetails?.task_type?.includes("VOICEOVER") ? 5 * 60 * 1000 : 60 * 1000
    );

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        timeSpentIntervalRef.current = setInterval(
          handleUpdateTimeSpent,
          taskDetails?.task_type?.includes("VOICEOVER") ? 5 * 60 * 1000 : 60 * 1000
        );
      } else {
        handleUpdateTimeSpent(ref.current);
        clearInterval(timeSpentIntervalRef.current);
        ref.current = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timeSpentIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [taskDetails]);
};

import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { APITransport, UpdateTimeSpentPerTask } from "redux/actions";

export const useUpdateTimeSpent = (ref) => {
  const { taskId } = useParams();
  const timeSpentIntervalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpdateTimeSpent = (time = 60) => {
      const apiObj = new UpdateTimeSpentPerTask(taskId, time);
      dispatch(APITransport(apiObj));
    };

    timeSpentIntervalRef.current = setInterval(
      handleUpdateTimeSpent,
      60 * 1000
    );

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        timeSpentIntervalRef.current = setInterval(
          handleUpdateTimeSpent,
          60 * 1000
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
  }, []);
};

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { APITransport, UpdateTimeSpentPerTask } from "redux/actions";

export const useUpdateTimeSpent = (taskId) => {
  const dispatch = useDispatch();
  const timeSpentIntervalRef = useRef(null);
  const ref = useRef(0);

  const handleUpdateTimeSpent = (time = 60) => {
    const apiObj = new UpdateTimeSpentPerTask(taskId, time);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    timeSpentIntervalRef.current = setInterval(
      handleUpdateTimeSpent,
      60 * 1000
    );

    const handleBeforeUnload = (event) => {
      handleUpdateTimeSpent(ref.current);
      event.preventDefault();
      event.returnValue = "";
      ref.current = 0;
    };

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

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timeSpentIntervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    
    // eslint-disable-next-line
  }, [taskId, dispatch]);
};

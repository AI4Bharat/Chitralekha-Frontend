import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { APITransport, UpdateTimeSpentPerTask } from "redux/actions";

export const useTimer = (
  updateInterval = 1000,
  resetInterval = 60 * 1000,
  taskId
) => {
  const dispatch = useDispatch();
  const ref = useRef(0);
  const intervalRef = useRef(null);

  const updateTimer = () => {
    ref.current = ref.current + 1;
  };

  useEffect(() => {
    intervalRef.current = setInterval(updateTimer, updateInterval);

    return () => {
      clearInterval(intervalRef.current);
      const apiObj = new UpdateTimeSpentPerTask(taskId, ref.current);
      dispatch(APITransport(apiObj));
      clearInterval(intervalRef.current);
      ref.current = 0;
    };

    // eslint-disable-next-line
  }, [taskId, dispatch]);

  useEffect(() => {
    const resetIntervalId = setInterval(() => {
      clearInterval(intervalRef.current);
      ref.current = 0;
      intervalRef.current = setInterval(updateTimer, updateInterval);
    }, resetInterval);

    return () => {
      clearInterval(resetIntervalId);
    };
  }, [updateInterval, resetInterval]);
};

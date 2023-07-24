import { useEffect, useRef } from "react";

function useAutosave(callback, delay = 1000, deps = []) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const runCallback = () => {
      savedCallback.current();
    };

    if (typeof delay === "number") {
      let interval = setInterval(runCallback, delay);

      return () => {
        clearInterval(interval);
      };
    }

    //eslint-disable-next-line
  }, [delay, ...deps]);
}

export default useAutosave;

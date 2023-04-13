import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchVideoSubtitleAPI from "../redux/actions/api/Project/FectchVideoSubtitle";
import constants from "../redux/constants";

export const useVideoSubtitle = (id) => {
  const [subtitle, setSubtitle] = useState([]);
  const { videoSubtitle } = useSelector((state) => state.getVideoSubtitle);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideoSubtitle = async () => {
      const obj = new FetchVideoSubtitleAPI(id);
      const response = await fetch(obj.apiEndPoint(), {
        method: "GET",
        headers: obj.getHeaders().headers,
      });
      const payload = await response.json();
      dispatch({ type: constants.GET_VIDEO_SUBTITLE, payload:{id,payload} });
      setSubtitle(payload);
    };

    if (!videoSubtitle.hasOwnProperty(id)) fetchVideoSubtitle();
    else setSubtitle(videoSubtitle[id]);

    // eslint-disable-next-line
  }, []);

  return {
    subtitle,
  };
};

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RightPanel from "./RightPanel";
import Timeline from "./Timeline";
import VideoPanel from "./VideoPanel";
import FetchTaskDetailsAPI from "../../../redux/actions/api/Project/FetchTaskDetails";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import FetchVideoDetailsAPI from "../../../redux/actions/api/Project/FetchVideoDetails";
import FetchTranscriptPayloadAPI from "../../../redux/actions/api/Project/FetchTranscriptPayload";

const VideoLanding = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  const [waveform, setWaveform] = useState();
  const [player, setPlayer] = useState();
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const taskDetails = useSelector((state) => state.getTaskDetails.data);

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(taskId);
    dispatch(APITransport(apiObj));
  }, []);

  useEffect(() => {
    if(taskDetails) {
      const apiObj = new FetchVideoDetailsAPI(
        taskDetails.video_url,
        taskDetails.src_language,
        taskDetails.project
      );
      dispatch(APITransport(apiObj));

      const payloadObj = new FetchTranscriptPayloadAPI(taskDetails.id, taskDetails.task_type);
      dispatch(APITransport(payloadObj))
    }
  }, [taskDetails]);

  return (
    <Box sx={{ mt: 7 }} height={"calc(100% - 56px)"}>
      <Box display={"flex"} height="calc(100% - 150px)">
        <VideoPanel
          setPlayer={setPlayer}
          setCurrentTime={setCurrentTime}
          setPlaying={setPlaying}
        />
        <RightPanel />
      </Box>
      <Box height={"150px"} position="relative">
        <Timeline
          waveform={waveform}
          setWaveform={setWaveform}
          player={player}
          render={render}
          setRender={setRender}
          currentTime={currentTime}
          playing={playing}
        />
      </Box>
    </Box>
  );
};

export default VideoLanding;

import { Box, Grid } from "@mui/material";
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
import TranslationRightPanel from "./TranslationRightPanel";
import CustomizedSnackbars from "../../../common/Snackbar";
import Sub from "../../../utils/Sub";

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
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [subs, setSubs] = useState([]);

  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(taskId);
    dispatch(APITransport(apiObj));
  }, []);

 
  useEffect(() => {
    if (taskDetails) {
      const apiObj = new FetchVideoDetailsAPI(
        taskDetails.video_url,
        taskDetails.src_language,
        taskDetails.project
      );
      dispatch(APITransport(apiObj));

      (async () => {
      const payloadObj = new FetchTranscriptPayloadAPI(taskDetails.id, taskDetails.task_type);
       dispatch(APITransport(payloadObj))
      //  fetch(payloadObj.apiEndPoint(), {
      //   method: "GET",
      //   body: JSON.stringify(payloadObj.getBody()),
      //   headers: payloadObj.getHeaders().headers,
      // })
      // .then(async (res) => {
      //       const rsp_data = await res.json();
      //   if (res.ok) {
      //     // setSnackbarInfo({
      //     //   open: true,
      //     //   message: resp?.message,
      //     //   variant: "success",
      //     // });
      //   } else {
      //     setSnackbarInfo({
      //       open: true,
      //       message: rsp_data?.message,
      //       variant: "error",
      //     });
      //   }
      // })

     // const resp = await res.json();
     
    })();
    }
  }, [taskDetails]);

  useEffect(() => {
    const sub = transcriptPayload?.payload?.payload.map(
      (item) => new Sub(item)
    );
    setSubs(sub);
  }, [transcriptPayload?.payload?.payload]);

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };


  return (
    <Grid>
       {renderSnackBar()}
      <Grid
        container
        direction={"row"}
        sx={{ marginTop: 7, overflow: "hidden" }}
      >
        <Grid width="100%" md={8} xs={12}>
          <VideoPanel
            setPlayer={setPlayer}
            setCurrentTime={setCurrentTime}
            setPlaying={setPlaying}
          />
        </Grid>
        <Grid md={4} xs={12} sx={{ width: "100%" }}>
          {(taskDetails?.task_type === "TRANSCRIPTION_EDIT" || taskDetails?.task_type === "TRANSCRIPTION_REVIEW") && <RightPanel />}
          {(taskDetails?.task_type === "TRANSLATION_EDIT" || taskDetails?.task_type === "TRANSLATION_REVIEW") && <TranslationRightPanel />}
        </Grid>
      </Grid>
      <Grid height={70} width={"100%"} position="fixed" bottom={1}>
        <Timeline
          waveform={waveform}
          setWaveform={setWaveform}
          player={player}
          render={render}
          setRender={setRender}
          currentTime={currentTime}
          playing={playing}
          subtitles={subs}
        />
      </Grid>
    </Grid>

    // <Grid sx={{ mt: 7 }} height={"calc(100% - 56px)"}>
    //   <Grid display={"flex"} height="calc(100% - 150px)">
    //     <VideoPanel
    //       setPlayer={setPlayer}
    //       setCurrentTime={setCurrentTime}
    //       setPlaying={setPlaying}
    //     />
    //     {(taskDetails?.task_type === "TRANSCRIPTION_EDIT" || taskDetails?.task_type === "TRANSCRIPTION_REVIEW") && <RightPanel />}
    //     {(taskDetails?.task_type === "TRANSLATION_EDIT" || taskDetails?.task_type === "TRANSLATION_REVIEW") && <TranslationRightPanel />}
    //   </Grid>
    //   <Grid height={"150px"} position="relative">
    //     <Timeline
    //       waveform={waveform}
    //       setWaveform={setWaveform}
    //       player={player}
    //       render={render}
    //       setRender={setRender}
    //       currentTime={currentTime}
    //       playing={playing}
    //     />
    //   </Grid>
    // </Grid>
  );
};

export default VideoLanding;

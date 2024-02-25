import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TranscriptionChart from "./charts/TranscriptionChart";
import VoiceoverChart from "./charts/VoiceoverChart";
import TranslationChart from "./charts/TranslationChart";
import {
  APITransport,
  FetchTranscriptionChartAPI,
  FetchTranslationChartAPI,
  FetchVoiceoverChartAPI,
} from "redux/actions";
import { Divider, Typography } from "@mui/material";
import { IntroDatasetStyle } from "styles";

const Charts = () => {
  const dispatch = useDispatch();
  const classes = IntroDatasetStyle();

  const [loading, setLoading] = useState(false);

  const transcriptChartData = useSelector(
    (state) => state.getChartsData.transcription
  );
  const translationChartData = useSelector(
    (state) => state.getChartsData.translation
  );
  const voiceoverChartData = useSelector(
    (state) => state.getChartsData.voiceover
  );

  useEffect(() => {
    setLoading(true);

    const transcriptObj = new FetchTranscriptionChartAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationChartAPI();
    dispatch(APITransport(translationObj));

    const voiceoverObj = new FetchVoiceoverChartAPI();
    dispatch(APITransport(voiceoverObj));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [transcriptChartData, translationChartData, voiceoverChartData]);

  return (
    <>
      <Typography variant="h4" className={classes.chartHeader}>
        Dashboard
      </Typography>
      <TranscriptionChart loading={loading} chartData={transcriptChartData} />
      <Divider />
      <TranslationChart loading={loading} chartData={translationChartData} />
      <Divider />
      <VoiceoverChart loading={loading} chartData={voiceoverChartData} />
    </>
  );
};

export default Charts;

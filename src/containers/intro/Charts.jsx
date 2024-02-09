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

const Charts = () => {
  const dispatch = useDispatch();

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
      <TranscriptionChart loading={loading} chartData={transcriptChartData} />
      <TranslationChart loading={loading} chartData={translationChartData} />
      <VoiceoverChart loading={loading} chartData={voiceoverChartData} />
    </>
  );
};

export default Charts;

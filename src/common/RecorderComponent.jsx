import { useRef } from "react";
import { VideoLandingStyle } from "styles";

import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { IconButton, Tooltip } from "@mui/material";

import MicIcon from "@mui/icons-material/MicOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const RecorderComponent = ({
  index,
  onStopRecording,
  durationError,
  handleFileUpload,
  isDisabled,
  updateRecorderState,
}) => {
  const recorderControls = useAudioRecorder();
  const {
    recordingTime,
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
  } = recorderControls;

  const classes = VideoLandingStyle();
  const $audioFile = useRef(null);
  const timeRef = useRef(0);

  if (recordingTime !== 0) {
    timeRef.current = recordingTime;
  }

  const handleStartRecording = () => {
    updateRecorderState("start", index);
    startRecording();
  };

  const handlePlayPauseRecording = () => {
    updateRecorderState("pause", index);
    togglePauseResume();
  };

  const handleStopRecording = (blob) => {
    updateRecorderState("stop", index);
    onStopRecording(blob, index, timeRef.current);
    timeRef.current = 0;
  };

  return (
    <div style={{ display: "flex" }}>
      {durationError[index] && (
        <Tooltip
          title="Audio length should be equal or less than duration"
          placement="bottom"
        >
          <IconButton
            className={classes.optionIconBtn}
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            <ReportProblemIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {!isRecording && (
        <Tooltip title="Record Audio" placement="bottom">
          <IconButton
            style={{ display: isDisabled ? "none" : "", background: "#fcf7e9" }}
            className={classes.optionIconBtn}
            onClick={() => handleStartRecording()}
          >
            <MicIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {isRecording && (
        <Tooltip title="Stop Recording" placement="bottom">
          <IconButton
            style={{ background: "#fcf7e9" }}
            className={classes.optionIconBtn}
            onClick={() => stopRecording()}
          >
            <StopIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {!isPaused && isRecording && (
        <Tooltip title="Pause Recording" placement="bottom">
          <IconButton
            style={{ background: "#fcf7e9" }}
            className={classes.optionIconBtn}
            onClick={() => handlePlayPauseRecording()}
          >
            <PauseIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      {isPaused && (
        <Tooltip title="Play Recording" placement="bottom">
          <IconButton
            style={{ background: "#fcf7e9" }}
            className={classes.optionIconBtn}
            onClick={() => handlePlayPauseRecording()}
          >
            <PlayArrowIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Upload Audio" placement="bottom">
        <IconButton
          style={{ display: isDisabled ? "none" : "", background: "#fcf7e9" }}
          className={classes.optionIconBtn}
          onClick={() => $audioFile.current.click()}
        >
          <UploadIcon className={classes.rightPanelSvg} />
          <input
            type="file"
            style={{ display: "none" }}
            ref={$audioFile}
            accept="audio/wav, audio/mp3"
            onChange={(event) => handleFileUpload(event, index)}
          />
        </IconButton>
      </Tooltip>

      <div style={{ display: "none" }}>
        <AudioRecorder
          onRecordingComplete={(blob) => handleStopRecording(blob)}
          recorderControls={recorderControls}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
        />
      </div>
    </div>
  );
};
export default RecorderComponent;

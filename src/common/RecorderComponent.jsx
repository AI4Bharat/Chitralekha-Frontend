import { useRef } from "react";
import { VideoLandingStyle } from "styles";

import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { IconButton, Tooltip } from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MicIcon from "@mui/icons-material/MicOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
  } = recorderControls;

  const classes = VideoLandingStyle();
  const $audioFile = useRef(null);

  const handleStartRecording = () => {
    updateRecorderState("start", index);
    startRecording();
  };

  const handleStopRecording = () => {
    updateRecorderState("stop", index);
    stopRecording();
  };

  const handlePauseRecording = () => {
    updateRecorderState("pause", index);
    togglePauseResume();
  };

  return (
    <div>
      {/* {durationError[index] && (
        <Tooltip
          title="Audio length should be equal or less than duration"
          placement="bottom"
        >
          <IconButton
            className={classes.optionIconBtn}
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            <ReportProblemIcon />
          </IconButton>
        </Tooltip>
      )} */}

      {isRecording && (
        <Tooltip title="Stop Recording" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handleStopRecording()}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      )}

      {!isRecording && (
        <Tooltip title="Record Audio" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handleStartRecording()}
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
      )}

      {!isPaused && isRecording && (
        <Tooltip title="Pause Recording" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handlePauseRecording()}
          >
            <PauseIcon />
          </IconButton>
        </Tooltip>
      )}

      {isPaused && (
        <Tooltip title="Play Recording" placement="bottom">
          <IconButton
            className={classes.optionIconBtn}
            onClick={() => handlePauseRecording()}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Upload Audio" placement="bottom">
        <IconButton
          style={{ display: isDisabled ? "none" : "" }}
          className={classes.optionIconBtn}
          onClick={() => $audioFile.current.click()}
        >
          <UploadIcon />
          <input
            type="file"
            style={{ display: "none" }}
            ref={$audioFile}
            accept="audio/wav, audio/mp3"
            onChange={(event) => handleFileUpload(event, index)}
          />
        </IconButton>
      </Tooltip>

      <div style={{display: "none"}}>
        <AudioRecorder
          onRecordingComplete={(blob) => onStopRecording(blob, index)}
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

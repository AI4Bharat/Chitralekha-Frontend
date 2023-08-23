import { useRef } from "react";
import { VideoLandingStyle } from "styles";

import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { IconButton, Tooltip } from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import UploadIcon from "@mui/icons-material/UploadOutlined";

const RecorderComponent = ({
  index,
  onStopRecording,
  durationError,
  handleFileUpload,
  isDisabled,
}) => {
  const recorderControls = useAudioRecorder();
  const { recordingTime } = recorderControls;

  const classes = VideoLandingStyle();
  const $audioFile = useRef(null);
  const timeRef = useRef(0);

  if (recordingTime !== 0) {
    timeRef.current = recordingTime;
  }

  const handleStopRecording = (blob) => {
    onStopRecording(blob, index, timeRef.current);
    timeRef.current = 0;
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        className={classes.optionIconBtn}
        style={{ display: isDisabled ? "none" : "" }}
      >
        <AudioRecorder
          onRecordingComplete={(blob) => handleStopRecording(blob)}
          recorderControls={recorderControls}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
        />
      </div>

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

      {durationError[index] && (
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
      )}
    </div>
  );
};
export default RecorderComponent;

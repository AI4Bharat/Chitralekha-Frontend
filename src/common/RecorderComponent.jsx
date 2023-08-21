import { useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { IconButton, Tooltip } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { VideoLandingStyle } from "styles";
import { useSelector } from 'react-redux';

const ExampleComponent = ({ index, onStopRecording, durationError }) => {
const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder
} = useAudioRecorder();
const classes = VideoLandingStyle();
const taskData = useSelector((state) => state.getTaskDetails.data);


useEffect(() => {
    if (!recordingBlob) return;
    // recordingBlob will be present at this point after 'stopRecording' has been called
}, [recordingBlob])
console.log(durationError[index], recordingTime);
return (
    <div>
        {taskData.task_type.includes("VOICEOVER") && durationError[index] && (
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
        <AudioRecorder
            onRecordingComplete={(blob) => onStopRecording(blob, index)}
            audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
            }}
        />
    </div>
)
};
export default ExampleComponent;
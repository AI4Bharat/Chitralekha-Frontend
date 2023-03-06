export const TaskStatus = [
    { value: "COMPLETE", label: "Complete"},
    { value: 'NEW', label: 'New' },
    { value: "INPROGRESS", label: "Inprogress" },
    { value: "SELECTED_SOURCE", label: "Selected Source" },
    { value: "POST_PROCESS", label: "Post Process" },
  ];

  export const TaskTypes = [
    { value: "TRANSCRIPTION_REVIEW", label: "Transcription Review"},
    { value: 'TRANSCRIPTION_EDIT', label: 'Transcription Edit' },
    { value: "TRANSLATION_REVIEW", label: "Translation Review" },
    { value: "TRANSLATION_EDIT", label: "Translation Edit" },
    { value: "VOICEOVER_EDIT", label: "VoiceOver Edit" },
  ];

  export default TaskStatus;
import C from "../../constants";

const initialState = {
  transcriptionLanguage: [],
  translationLanguage: [],
  voiceoverLanguage: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_SUPPORTED_VOICEOVER_LANGUAGES:
      return {
        ...state,
        voiceoverLanguage: action.payload,
      };

    case C.GET_SUPPORTED_TRANSLATION_LANGUAGES:
      return {
        ...state,
        translationLanguage: action.payload,
      };

    case C.GET_SUPPORTED_TRANSCRIPTION_LANGUAGES:
      return {
        ...state,
        transcriptionLanguage: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

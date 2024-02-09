import C from "../../constants";

let initialState = {
  transcription: [],
  translation: [],
  voiceover: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_TRANSCRIPTION_CHART:
      return {
        ...state,
        transcription: action.payload,
      };

    case C.GET_TRANSLATION_CHART:
      return {
        ...state,
        translation: action.payload,
      };

    case C.GET_VOICEOVER_CHART:
      return {
        ...state,
        voiceover: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

import C from "../../constants";

const initialState = {
  data: [],
  fullPayload: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_TRANSCRIPT_PAYLOAD:
      return {
        ...state,
        data: action.payload,
      };

    case C.GET_FULL_PAYLOAD:
      return {
        ...state,
        fullPayload: action.payload,
      };

    case C.CLEAR_STATE:
      return {
        ...state,
        data: action.payload,
        fullPayload: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

import C from "../../constants";

const initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_TRANSCRIPT_PAYLOAD:
      return {
        ...state,
        data: action.payload,
      };

    case C.CLEAR_STATE:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

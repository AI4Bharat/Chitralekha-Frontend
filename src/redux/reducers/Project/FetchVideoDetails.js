import C from "../../constants";

const initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_VIDEO_DETAILS:
      return {
        ...state,
        data: action.payload,
      };
    case C.CLEAR_VIDEO_DETAILS:
      return {
        ...state,
        data: [],
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducer;

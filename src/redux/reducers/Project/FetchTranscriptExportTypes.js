import C from "../../constants";

const initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_TRANSCRIPT_EXPORT_TYPE:
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

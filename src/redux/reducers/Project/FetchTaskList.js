import C from "../../constants";

const initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_TASK_LIST:
      return {
        ...state,
        data: action.payload,
      };
    case C.CLEAR_PROJECT_TASK_LIST:
      return {
        ...state,
        data: []
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

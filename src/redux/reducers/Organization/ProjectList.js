import C from "../../constants";

const initialState = {};

const getProjects = (state, payload) => {
  return "";
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_PROJECT_LIST:
      return getProjects(state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
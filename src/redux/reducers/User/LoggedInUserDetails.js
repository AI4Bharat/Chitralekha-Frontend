import C from "../../constants";

const initialState = {};

const getLoggedInUserDetails = (state, payload) => {
  return "";
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_LOGGEDIN_USER_DETAILS:
      return getLoggedInUserDetails(state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

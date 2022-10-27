import C from "../../constants";

const initialState = {};

const getUsers = (state, payload) => {
  return "";
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_USER_LIST:
      return getUsers(state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
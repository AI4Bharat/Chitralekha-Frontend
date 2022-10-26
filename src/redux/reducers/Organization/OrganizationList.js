import C from "../../constants";

const initialState = {};

const getOrganizations = (state, payload) => {
  return "";
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_ORGANIZATION_LIST:
      return getOrganizations(state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

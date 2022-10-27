import C from "../../constants";

const initialState = {};

const getOrganizationDetails = (state, payload) => {
  return "";
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.GET_ORGANIZATION_DETAILS:
      return getOrganizationDetails(state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

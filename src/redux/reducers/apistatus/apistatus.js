import constants from "../../constants";

const initialState = {
  progress: true,
  errors: false,
  message: "",
  unauthorized: false,
  apiType: "",
  data: [],
  success: true,
};

const apistatus = (state = initialState, action) => {
  switch (action.type) {
    case constants.APISTATUS:
      return action.payload;

    default:
      return state;
  }
};

export default apistatus;

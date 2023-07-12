import axios from "axios";
import C from "../../constants";
import strings from "../../string";
import { setSnackBar } from "../Common";

const dispatchAPIAsync = (api) => {
  return {
    type: api.type,
    endpoint: api.apiEndPoint(),
    payload: api.getPayload(),
  };
};

const apiStatusAsync = (payload) => {
  return {
    type: C.APISTATUS,
    payload,
  };
};

const success = (res, api, dispatch) => {
  const { data, status } = res;

  api.processResponse(data);

  const payload = {
    progress: false,
    loading: false,
    errors: false,
    message: data.message,
    unauthorized: false,
    apiType: api.type,
    data,
    success: true,
  };

  dispatch(apiStatusAsync(payload));

  if (api.type) {
    dispatch(dispatchAPIAsync(api));
  }

  dispatch(
    setSnackBar({
      open: data.message ? true : false,
      message: data.message,
      variant: "success",
    })
  );

  if (
    typeof api.processNextSuccessStep === "function" &&
    (status === 200 || status === 201)
  ) {
    api.processNextSuccessStep(data);
  }
};

const error = (err, api, dispatch) => {
  const {
    response: {
      data: { message },
      status,
    },
  } = err;

  const {
    error: {
      message: { http },
    },
  } = strings;

  let errorMsg = message ?? http[status];

  const payload = {
    progress: false,
    loading: false,
    errors: true,
    message: errorMsg,
    unauthorized: status === 401,
    apiType: api.type,
    data: err.response.data,
    success: false,
  };

  dispatch(apiStatusAsync(payload));

  if (typeof api.processNextErrorStep === "function") {
    api.processNextErrorStep();
  }

  dispatch(
    setSnackBar({
      open: true,
      message: errorMsg,
      variant: "error",
    })
  );

  if (status === 401) {
    window.location.replace("/");
  }
};

export const updateMessage = apiStatusAsync;

export default function dispatchAPI(api) {
  return (dispatch) => {
    const { method } = api;

    const payload = {
      progress: true,
      loading: true,
      errors: false,
      message: "",
      unauthorized: false,
      apiType: "",
      data: "",
      success: false,
    };

    dispatch(apiStatusAsync(payload));

    let request;
    switch (method) {
      case "MULTIPART":
        request = axios.post(
          api.apiEndPoint(),
          api.getFormData(),
          api.getHeaders()
        );
        break;

      case "PATCH":
        request = axios.patch(
          api.apiEndPoint(),
          api.getBody(),
          api.getHeaders()
        );
        break;

      case "POST":
        request = axios.post(
          api.apiEndPoint(),
          api.getBody(),
          api.getHeaders()
        );
        break;

      case "PUT":
        request = axios.put(api.apiEndPoint(), api.getBody(), api.getHeaders());
        break;

      case "DELETE":
        request = axios.delete(api.apiEndPoint(), api.getHeaders());
        break;

      default:
        request = axios.get(api.apiEndPoint(), api.getHeaders());
        break;
    }

    request
      .then((res) => success(res, api, dispatch))
      .catch((err) => error(err, api, dispatch));
  };
}

import axios from "axios";
import strings from "../../string";
import { setSnackBar } from "../Common";

const dispatchAPIAsync = (api) => {
  return {
    type: api.type,
    endpoint: api.apiEndPoint(),
    payload: api.getPayload(),
  };
};

const success = (res, api, dispatch) => {
  const { data, status } = res;

  api.processResponse(data);

  if (api.type) {
    dispatch(dispatchAPIAsync(api));
  }

  if (data.message) {
    dispatch(
      setSnackBar({
        open: true,
        message: data.message,
        variant: "success",
      })
    );
  }

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

  if (status === 401 && api.type !== "GET_USER_ACCESS_TOKEN") {
    window.location.replace("/#/login");
  }
};

export default function dispatchAPI(api) {
  return (dispatch) => {
    const { method } = api;

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

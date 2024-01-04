import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UnSubscribeNewletterFromEmailAPI extends API {
  constructor(email, category, timeout = 2000) {
    super("GET", timeout, false);

    this.type = C.UNSUBSCRIBE_FROM_EMAIL;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.unSubscribeFromEmail
    }?email=${email}&categories=${category}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      localStorage.setItem("userData", JSON.stringify(res));
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {}

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class SignupAPI extends API {
  constructor(id, data, timeout = 2000) {
    super("PATCH", timeout, false);
    this.id = id;
    this.data = data;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.signup
    }${id}/accept/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      localStorage.setItem("token", res.access);
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.data;
  }

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

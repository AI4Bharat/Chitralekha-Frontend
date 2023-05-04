import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class StoreAccessTokenAPI extends API {
  constructor(data, timeout = 2000) {
    super("POST", timeout, false);
    this.data = data;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.youtube
    }store_access_token`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
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
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

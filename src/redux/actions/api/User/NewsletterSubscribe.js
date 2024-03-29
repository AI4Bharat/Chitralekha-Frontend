/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateSubscriptionAPI extends API {
  constructor(payload, timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.SUBSCRIBE_TO_NEWSLETTER;

    this.payload = payload;

    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.updateSubscription}`;
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
    return this.payload;
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

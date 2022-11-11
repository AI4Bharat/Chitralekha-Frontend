import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class ForgotPasswordAPI extends API {
  constructor(email, timeout = 2000) {
    super("POST", timeout, false);
    this.email = email;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.resetPassword}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.forgotpassword = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
        email: this.email
    };
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
    return this.forgotpassword;
  }
}

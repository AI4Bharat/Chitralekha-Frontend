import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class ConfirmForgotPasswordAPI extends API {
  constructor(uid, token, newPassword, timeout = 2000) {
    super("POST", timeout, false);
    this.uid = uid;
    this.token = token;
    this.newPassword = newPassword;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.confirmResetPassword}`;
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
        uid: this.uid,
        token: this.token,
        new_password: this.newPassword,
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

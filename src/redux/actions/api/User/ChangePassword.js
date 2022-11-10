import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class ChangePasswordAPI extends API {
  constructor(newPassword, currentPassword, timeout = 2000) {
    super("POST", timeout, false);
    this.newPassword = newPassword;
    this.currentPassword = currentPassword;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.changePassword}`;
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
    return {
      newPassword: this.newPassword,
      currentPassword: this.currentPassword,
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

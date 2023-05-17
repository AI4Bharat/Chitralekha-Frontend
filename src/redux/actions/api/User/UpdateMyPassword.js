import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UpdateMyPasswordAPI extends API {
  constructor(id, newPassword, currentPassword, timeout = 2000) {
    super("PATCH", timeout, false);
    this.newPassword = newPassword;
    this.currentPassword = currentPassword;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUserDetails}${id}/update_my_password/`;
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
      new_password1: this.newPassword,
      old_password: this.currentPassword,
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

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ToggleMailsAPI extends API {
  constructor(userId, enableMails, timeout = 2000) {
    super("POST", timeout, false);
    this.userId = userId;
    this.enableMails = enableMails;
    this.type = C.TOGGLE_MAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUserDetails}enable_email/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.toggleMails = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      user_id: this.userId,
      enable_email: this.enableMails,
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.toggleMails;
  }
}

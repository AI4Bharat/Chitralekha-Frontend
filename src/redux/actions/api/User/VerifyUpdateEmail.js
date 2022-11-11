import C from "../../../constants";
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class VerifyUpdateEmailAPI extends API {
  constructor(oldEmailCode, newEmailCode, timeout = 2000) {
    super("POST", timeout, false);
    this.oldEmailCode = oldEmailCode;
    this.newEmailCode = newEmailCode;
    this.type = C.VERIFY_UPDATE_EMAIL;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.verifyUpdateEmail}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.verifyEmail = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      old_email_update_code: this.oldEmailCode,
      new_email_verification_code: this.newEmailCode,
    };
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
    return this.verifyEmail;
  }
}

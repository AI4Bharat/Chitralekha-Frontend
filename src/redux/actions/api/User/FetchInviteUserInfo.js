import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchInviteUserInfoAPI extends API {
  constructor(inviteCode, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_INVITE_USER_DETAILS;
    this.inviteCode = inviteCode;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.signup
    }${inviteCode}/get_invited_user_info/`;
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

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateProfileAPI extends API {
  constructor(data, id, timeout = 2000) {
    super("PATCH", timeout, false);
    this.data = data;
    this.type = C.UPDATE_PROFILE;
    this.queryStr = id ? `/users/account/${id}/update/` : ENDPOINTS.updateProfile;
    this.endpoint = `${super.apiEndPointAuto()}${this.queryStr}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.updateEmail = res;
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
    return this.updateEmail;
  }
}

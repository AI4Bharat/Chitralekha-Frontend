import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateMemberPasswordAPI extends API {
  constructor(password, id, timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.CREATE_NEW_ORGANIZATION;
    this.password = password;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUserDetails}${id}/update_password/`;
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
    return { password: this.password };
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

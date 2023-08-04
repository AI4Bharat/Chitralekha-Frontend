import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateUserRoleAPI extends API {
  constructor(data, timeout = 2000) {
    super("POST", timeout, false);
    this.data = data;
    this.type = C.UPDATE_USER_ROLE;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.userRoles
    }update_user_role/`;
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

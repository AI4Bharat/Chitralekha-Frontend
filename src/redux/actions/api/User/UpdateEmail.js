import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateEmailAPI extends API {
  constructor(email, id, timeout = 2000) {
    super("POST", timeout, false);
    this.email = email;
    this.id = id;
    this.type = C.UPDATE_EMAIL;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.updateEmail}`;
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
    return {
      email: this.email,
      id: this.id
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
    return this.updateEmail;
  }
}

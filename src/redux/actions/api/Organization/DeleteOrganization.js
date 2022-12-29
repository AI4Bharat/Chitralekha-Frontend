import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DeleteOrganizationAPI extends API {
  constructor(id, timeout = 2000) {
    super("DELETE", timeout, false);
    this.type = C.DELETE_ORGANIZATION;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.organization}${id}/`;
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

  getBody() {}

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

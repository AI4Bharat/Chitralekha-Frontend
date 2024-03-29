import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class EditOrganizationDetailsAPI extends API {
  constructor(id, data, timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.EDIT_ORGANIZATION_DETAILS;
    this.id = id;
    this.data = data;
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
    return this.report;
  }
}

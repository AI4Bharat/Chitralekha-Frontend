import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class EditProjectDetailsAPI extends API {
  constructor(updateData, id, timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.EDIT_PROJECT_DETAILS;
    this.updateData = updateData;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.project}${id}/`;
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
    return this.updateData;
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

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateNewOrganizationAPI extends API {
  constructor(reqBody, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.CREATE_NEW_ORGANIZATION;
    this.reqBody = reqBody;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.organization}`;
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
    return this.reqBody;
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

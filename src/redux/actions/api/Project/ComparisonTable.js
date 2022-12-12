import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ComparisionTableAPI extends API {
  constructor(id, data,timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.COMPARISION_TABLE;
    this.id = id;
    this.data = data;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.task}${id}/select_source/`;
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

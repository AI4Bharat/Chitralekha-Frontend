import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UpdateEmail extends API {
  constructor(data, timeout = 2000) {
    super("POST", timeout, false);
    this.data=data;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.updateEmail}`;
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
    return {
      email: this.data,
      // id: this.id,
      // subscribe:this.subscribe
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

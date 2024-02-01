import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateTipsAPI extends API {
  constructor(tips, timeout = 2000) {
    super("PATCH", timeout, false);

    this.tips = tips;
    this.type = C.UPDATE_TIPS;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.getUserDetails
    }tips/`;
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
      tips: this.tips,
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

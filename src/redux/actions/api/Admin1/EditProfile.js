
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetUserDetailUpdateAPI extends API {
  constructor(Id,projectObj,timeout = 2000) {
    super("PATCH", timeout, false);
    this.projectObj = projectObj;
    // this.type = constants.GET_USER_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUserDetails}${Id}/update/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.userDetailUpdate = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.projectObj;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Authorization token not found in localStorage');
    }

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.userDetailUpdate
  }
}

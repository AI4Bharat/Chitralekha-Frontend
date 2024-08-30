
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetUserDetailAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_USER_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUserDetails}get_all_users`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.userDetail = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {}

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
    return this.userDetail
  }
}

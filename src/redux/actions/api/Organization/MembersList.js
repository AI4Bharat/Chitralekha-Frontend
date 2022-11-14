//API to get the list of Members in the organization.

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class MembersListAPI extends API {
  constructor(id,timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_MEMBERS_LIST;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.project}${id}/users/`;
  }  

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.membersList = res;
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
        "Authorization":`JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.membersList;
  }
}

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class AddOrganizationMemberAPI extends API {
  constructor(id, role, email, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.ADD_ORGANIZATION_MEMBER;
    this.id = id;
    this.role = role;
    this.email = email;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.addOrganizationMember}`;
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
        role : this.role,
        emails: [this.email],
        organization_id: this.id,
    } 
  }

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
    return this.report;
  }
}

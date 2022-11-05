import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class EditOrganizationDetailsAPI extends API {
  constructor(id, title, email, timeout = 2000) {
    super("PUT", timeout, false);
    this.type = C.EDIT_ORGANIZATION_DETAILS;
    this.id = id;
    this.title = title;
    this.email = email;
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
    return {
        title : this.title,
        email_domain_name: this.email,
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

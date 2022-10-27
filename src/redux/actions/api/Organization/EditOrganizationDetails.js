import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class EditOrganizationDetailsAPI extends API {
  constructor(id, name, timeout = 2000) {
    super("PUT", timeout, false);
    this.type = C.EDIT_ORGANIZATION_DETAILS;
    this.id = id;
    this.name = name;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.organization}${id}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        console.log(res,'res');
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
        name : this.name
    } 
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization":`${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

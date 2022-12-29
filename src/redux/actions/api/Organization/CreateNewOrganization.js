import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateNewOrganizationAPI extends API {
  constructor(title, emailDomainName, owner, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.CREATE_NEW_ORGANIZATION;
    this.title = title;
    this.emailDomainName = emailDomainName;
    this.owner = owner;
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
    return {
      title: this.title,
      email_domain_name: this.emailDomainName,
      organization_owner: this.owner,
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
    return this.report;
  }
}

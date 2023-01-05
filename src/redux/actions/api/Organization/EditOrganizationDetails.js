import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class EditOrganizationDetailsAPI extends API {
  constructor(id, title, email, organizationOwner, default_task_types, default_target_languages, timeout = 2000) {
    super("PUT", timeout, false);
    this.type = C.EDIT_ORGANIZATION_DETAILS;
    this.id = id;
    this.title = title;
    this.email = email;
    this.organizationOwner = organizationOwner;
    this.default_task_types = default_task_types;
    this.default_target_languages = default_target_languages;
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
        organization_owner: this.organizationOwner,
        default_task_types: this.default_task_types ,
        default_target_languages: this.default_target_languages,
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

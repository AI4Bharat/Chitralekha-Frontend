import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateMemberAPI extends API {
  constructor(orgName, email, roles, timeout = 2000) {
    super("POST", timeout, false);

    this.type = C.CREATE_MEMBER;

    this.orgName = orgName;
    this.email = email;
    this.roles = roles;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.signup
    }create_onboarding_account/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      localStorage.setItem("userData", JSON.stringify(res));
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      org_name: this.orgName,
      email: this.email,
      roles: this.roles.map((item) => item.value),
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

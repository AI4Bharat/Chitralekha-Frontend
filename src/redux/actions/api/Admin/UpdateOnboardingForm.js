import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateOnboardingFormAPI extends API {
  constructor(id, payload, timeout = 2000) {
    super("PATCH", timeout, false);
    this.type = C.UPDATE_ONBOARDING_FORM;

    this.id = id;
    this.payload = payload;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.organization
    }onboard/${id}/`;
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
    return this.payload;
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

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class OnBoardingAPI extends API {
  constructor(
    orgName,
    orgPortal,
    email,
    phone,
    orgType,
    purpose,
    source,
    timeout = 2000
  ) {
    super("GET", timeout, false);

    this.type = C.ONBOARDING;

    this.orgName = orgName;
    this.orgPortal = orgPortal;
    this.email = email;
    this.phone = phone;
    this.orgType = orgType.length ? orgType : "NA";
    this.purpose = purpose.length ? purpose : "NA";
    this.source = source.length ? source : "NA";

    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.onboarding}${
      this.orgName
    }/${this.orgPortal}/${this.email}/${this.phone}/${this.orgType}/${
      this.purpose
    }/${this.source}/`;
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

  getBody() {}

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}

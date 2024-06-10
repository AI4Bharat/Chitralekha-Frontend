import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class OnBoardingAPI extends API {
  constructor(payload, timeout = 2000) {
    super("GET", timeout, false);

    this.type = C.ONBOARDING;

    const keysString = Object.keys(payload.usage)
      .filter((key) => payload.usage[key])
      .join(" ");

    this.orgName = payload.orgName;
    this.orgPortal = payload.orgPortal;
    this.email = payload.email;
    this.phone = payload.phone;
    this.orgType = payload.orgType.length ? payload.orgType : "NA";
    this.purpose = payload.purpose.length ? payload.purpose : "NA";
    this.source = payload.source.length ? payload.source : "NA";
    this.keysString = keysString;
    this.srcLanguage = payload.srcLanguage ? payload.srcLanguage : "NA";
    this.tgtLanguage = payload.tgtLanguage ? payload.tgtLanguage : "NA";

    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.onboarding}${
      this.orgName
    }/${this.orgPortal}/${this.email}/${this.phone}/${this.orgType}/${
      this.purpose
    }/${this.source}/${this.keysString}/${this.srcLanguage}/${
      this.tgtLanguage
    }`;
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

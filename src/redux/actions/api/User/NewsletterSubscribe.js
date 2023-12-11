/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class NewsletterSubscribe extends API {
  constructor(email, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SUBSCRIBE_TO_NEWSLETTER;
    this.email = email;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.newsletterSubscribe}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      // localStorage.setItem('token', res.access);
        this.report = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      email: this.email
    };
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
    return this.report
  }
}

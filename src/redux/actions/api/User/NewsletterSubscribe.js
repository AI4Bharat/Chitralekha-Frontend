/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class NewsletterSubscribe extends API {
  constructor(email,id,subscribe, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SUBSCRIBE_TO_NEWSLETTER;
    this.email = email;
    this.id = id;
    this.subscribe = subscribe;
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
      email: this.email,
      user_id:this.id,
      subscribe: this.subscribe
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

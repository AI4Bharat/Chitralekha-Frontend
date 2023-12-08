import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class NewsletterSubscribe extends API {
  constructor(data,email,id,subscribe, timeout = 2000) {
    super("POST", timeout, false);
    this.email = email;
    this.id = id;
    this.subscribe = subscribe;
    this.type = C.SUBSCRIBE_TO_NEWSLETTER;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.newsletterSubscribe}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.subscribe = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {

    return {
      email: this.email,
      id: user_id,
      subscribe: subscribe
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.subscribe;
  }
}

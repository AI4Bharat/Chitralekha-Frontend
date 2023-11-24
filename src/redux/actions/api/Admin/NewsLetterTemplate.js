import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class NewsletterTemplate extends API {
    constructor(payload, templateId, timeout = 2000) {
        super("POST", timeout, false);
        this.payload = payload;
        this.templateId = templateId;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.newsletter}`;
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
            ...this.payload
        }
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
        return this.status;
    }
}

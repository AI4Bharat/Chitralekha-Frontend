import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class NewsletterPreview extends API {
    constructor(payload, templateId, timeout = 2000) {
        super("POST", timeout, false);
        this.payload = payload;
        this.templateId = templateId;
        this.type = C.GET_TEMPLATE_PREVIEW;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.preview}`;
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
        return this.report;
    }
}

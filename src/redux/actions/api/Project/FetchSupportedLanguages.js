import API from "../../../api";
import C from "../../../constants";

export default class FetchSupportedLanguagesAPI extends API {
    constructor(timeout = 2000) {
        super("GET", timeout, false);
        this.type = C.GET_SUPPORTED_LANGUAGES;
        this.endpoint = `${super.apiEndPointAuto()}/transcript/generate/supported_languages`;
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

    getBody() { }

    getHeaders() {
        this.headers = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${localStorage.getItem('token')}`
            },
        };
        return this.headers;
    }

    getPayload() {
        return this.report;
    }
}

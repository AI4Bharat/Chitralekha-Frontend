import API from "../../../api"
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UpdateAndReplaceWordsAPI extends API {
    constructor(id, taskType, word_to_replace, replace_word, replace_full_word, transliteration_language,timeout=2000) {
        super("POST", timeout, false);
        this.type = C.FIND_AND_REPLACE_FOR_FULL_PAYLOAD;
        this.id = id;
        this.word_to_replace = word_to_replace;
        this.replace_word = replace_word;
        this.replace_full_word = replace_full_word;
        this.transliteration_language = transliteration_language;
        this.payloadEndpoint = taskType?.includes("TRANSCRIPTION")
          ? ENDPOINTS.transcript
          : taskType?.includes("VOICEOVER")
          ? ENDPOINTS.voiceover
          : ENDPOINTS.translation;
        this.endpoint = `${super.apiEndPointAuto()}${
          this.payloadEndpoint
        }replace_all_words/`;
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
        return{
          "task_id": this.id,
          "word_to_replace": this.word_to_replace,
          "replace_word": this.replace_word,
          "replace_full_word": this.replace_full_word,
          "transliteration_language": this.transliteration_language
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

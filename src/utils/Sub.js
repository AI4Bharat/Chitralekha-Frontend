import clamp from "lodash/clamp";
import DT from "duration-time-conversion";

// Utility function to extract speaker from text
const extractSpeakerFromText = (text) => {
  if (!text || typeof text !== "string") {
    return { speakerName: null, cleanText: text };
  }

  const firstLine = text.split('\n')[0];
  const speakerPattern = /^([A-Za-z0-9]+):\s*(.*)$/;
  const match = firstLine.match(speakerPattern);

  if (match) {
    const speakerName = match[1];
    const textAfterTag = match[2];
    
    // If there are multiple lines, append remaining lines
    const lines = text.split('\n');
    let cleanText = textAfterTag;
    if (lines.length > 1) {
      cleanText = textAfterTag + "\n" + lines.slice(1).join('\n');
    }

    return { speakerName, cleanText };
  }

  return { speakerName: null, cleanText: text };
};

export default class Sub {
  constructor(obj) {
    this.start_time = obj.start_time;
    this.end_time = obj.end_time;
    this.text = obj.text;
    this.target_text = obj.target_text;
    this.audio = obj.audio;
    this.text_changed = obj.text_changed ?? false;
    this.time_difference = obj.time_difference;
    this.id = obj.id;
    this.audio_speed = obj.audio_speed;
    this.speaker_id = obj.speaker_id;
    this.transcription_text = obj.transcription_text;
    this.paraphrased_text = obj.paraphrased_text;
    this.verbatim_text = obj.verbatim_text;
    this.fast_audio = obj.fast_audio;
    this.image_url = obj.image_url;
    this.speaker_name = obj.speaker_name || null;

    // Extract speaker name from text if present and not already in speaker_name
    if (!this.speaker_name && this.text) {
      const { speakerName, cleanText } = extractSpeakerFromText(this.text);
      if (speakerName) {
        this.speaker_name = speakerName;
        this.text = cleanText;
      }
    }
  }

  get check() {
    return (
      this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime
    );
  }

  get clone() {
    return new Sub(this);
  }

  get startTime() {
    return DT.t2d(this.start_time);
  }

  set startTime(time) {
    this.start_time = DT.d2t(clamp(time, 0, Infinity));
  }

  get endTime() {
    return DT.t2d(this.end_time);
  }

  set endTime(time) {
    this.end_time = DT.d2t(clamp(time, 0, Infinity));
  }

  get duration() {
    return parseFloat((this.endTime - this.startTime).toFixed(3));
  }
}

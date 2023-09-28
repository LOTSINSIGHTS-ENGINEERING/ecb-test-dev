import axios from "axios";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class MailApi {
  API_URI: string;

  constructor(private api: AppApi, private store: AppStore, URI: string) {
    this.API_URI = URI;
  }

  async sendMail(to: string[], from: string, subject: string, message: string) {
    const body = {
      from: from,
      to: to.join(", "),
      subject,
      message,
    };

    const uri = `${this.API_URI}${new URLSearchParams(body)}`;
    const response = await axios.get(uri);
    return response;
  }

  async sendMailCC(
    to: string[],
    cc: string[],
    from: string,
    subject: string,
    message: string
  ) {
    const body = {
      from: from,
      to: to.join(", "),
      cc: cc.join(", "),
      subject,
      message,
    };

    const uri = `${this.API_URI}${new URLSearchParams(body)}`;
    const response = await axios.get(uri);
    return response;
  }
}

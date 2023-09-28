import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultFeedback: IFeedback = {
  sender: "",
  anonymously: false,
  context: "",
  proceed: "",
  questions: [],
  responses: [],
  feeling: "",
  recipient: "",
  type: "submission",
  category: "unprompted",
  message: "",
  date: new Date().toLocaleDateString(),
  effect: "",
  companyValue: "",
  impact: "",
  observation: "",
  reason: "",
  suggestion: "",
  feel: "",
  receivers: []
};

export interface IFeedback {
  id?: string,
  sender: string,
  recipient: string,
  receivers: string[],
  anonymously: boolean,
  context: string,
  proceed: string,
  impact: string,
  questions: string[],
  responses: string[],
  feeling: string,
  type: "submission" | "request",
  category: "unprompted" | "ideas" | "praise" | "peers-feedback" | "request" | string,
  message: string,
  effect: string;
  companyValue: string;
  observation: string;
  reason: string;
  suggestion: string;
  feel: string;
  date: string,
}

export default class Feedback {
  private _feedback: IFeedback;

  constructor(private store: AppStore, feedback: IFeedback) {
    makeAutoObservable(this);
    this._feedback = feedback;
  }

  get asJson(): IFeedback {
    return toJS(this._feedback);
  }
}
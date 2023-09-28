import { makeAutoObservable, toJS } from "mobx";
import { totalQ2IndividualObjectiveRating, totalQ4IndividualObjectiveRating } from "../../logged-in/shared/functions/Scorecard";
import AppStore from "../stores/AppStore";
import Measure from "./Measure";

interface IObjectiveRating {
  rate: number;
  isUpdated: boolean;
}

export const defaultObjective: IObjective = {
  id: "",
  uid: "",
  userName: "",
  parent: "",
  theme: "",
  perspective: "Financial",
  description: "",
  department: "",
  division: "",
  weight: 0,
  createdAt: Date.now(),
  draftComment: "",
  midComment: "",
  assessComment: ""
};

export interface IObjective {
  id: string;
  uid: string;
  userName: string;
  parent: string; // parent id
  theme: string;
  perspective: string;
  objectiveType?: "self-development" | "performance";
  description: string;
  department: string;
  division: string;
  weight: number | null;
  createdAt: number;
  draftComment: string;
  midComment: string;
  assessComment: string;
}

export default class Objective {
  private objective: IObjective;

  constructor(private store: AppStore, objective: IObjective) {
    makeAutoObservable(this);
    this.objective = objective;
  }

  get asJson(): IObjective {
    return toJS(this.objective);
  }

  get measures(): Measure[] {
    const uid = this.objective.uid;
    return this.store.measure.getByUid(uid).filter((measure) => measure.asJson.objective === this.objective.id);
  }

  get q2Rating(): IObjectiveRating {
    const measuresUpdated = this.measures.some((m) => m.asJson.isUpdated);
    const rating = totalQ2IndividualObjectiveRating(
      this.measures.map((o) => o.asJson)
    );
    return {
      rate: rating,
      isUpdated: measuresUpdated,
    };
  }

  get q4Rating(): IObjectiveRating {
    const measuresUpdated = this.measures.some((m) => m.asJson.isUpdated);
    const rating = totalQ4IndividualObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating,
      isUpdated: measuresUpdated,
    };
  }
}

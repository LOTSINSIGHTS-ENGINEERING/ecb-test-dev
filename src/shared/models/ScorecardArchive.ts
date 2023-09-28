import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IMeasure } from "./Measure";
import { IMeasureAudit } from "./MeasureAudit";
import { IObjective } from "./Objective";

export const defaultArchive: IScorecardArchive = {
  uid: "",
  displayName: "",
  archiverDisplayName: "",
  archiverUid: "",
  objectives: [],
  measures: [],
  measureAudits: [],
  isLocked: false,
};

export interface IScorecardArchive {
  uid: string;
  displayName: string | null;
  archiverUid: string;
  archiverDisplayName: string | null;
  objectives: IObjective[];
  measures: IMeasure[];
  measureAudits: | IMeasureAudit[];
  isLocked: boolean;
}

export default class ScorecardArchive {
  private archive: IScorecardArchive;
  constructor(private store: AppStore, archive: IScorecardArchive) {
    makeAutoObservable(this);
    this.archive = archive;
  }
  get asJson(): IScorecardArchive {
    return toJS(this.archive);
  }
  get objectives(): IObjective[] {
    return toJS(this.asJson.objectives);
  }
  get measures(): IMeasure[] {
    return toJS(this.asJson.measures);
  }
  get measureAudits(): IMeasureAudit[] {
    return toJS(this.asJson.measureAudits);
  }
}

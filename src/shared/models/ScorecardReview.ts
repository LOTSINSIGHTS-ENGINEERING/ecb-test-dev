import { toJS } from "mobx";
import { IMeasure } from "./Measure";
import { IMeasureAudit } from "./MeasureAudit";
import { IMeasureAuditCompany } from "./MeasureAuditCompany";
import { IMeasureCompany } from "./MeasureCompany";
import Model from "./Model";
import { IObjective } from "./Objective";

export const defaultReview: IScorecardReview = {
  uid: "",
  displayName: "",
  reviewerDisplayName: "",
  reviewerUid: "",
  objectives: [],
  measures: [],
  measureAudits: [],
  isLocked: false,
};

export interface IScorecardReview {
  uid: string;
  displayName: string | null;
  reviewerUid: string;
  reviewerDisplayName: string | null;
  objectives: IObjective[];
  measures: IMeasure[] | IMeasureCompany[];
  measureAudits: | IMeasureAudit[] | IMeasureAuditCompany[];
  isLocked: boolean;
}

export default class ScorecardReview extends Model<IScorecardReview> {
  get objectives(): IObjective[] {
    return toJS(this.asJson.objectives);
  }

  get measures(): IMeasure[] | IMeasureCompany[] {
    return toJS(this.asJson.measures);
  }

  get measureAudits(): | IMeasureAudit[] | IMeasureAuditCompany[] {
    return toJS(this.asJson.measureAudits);
  }
}

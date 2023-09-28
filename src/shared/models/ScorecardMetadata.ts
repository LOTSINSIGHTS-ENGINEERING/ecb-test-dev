import Model from "./Model";
import { IReviewCycleStatus, IReviewCycleType } from "./ScorecardBatch";

export const defaultScorecardCycleMetadata: IScorecardCycleMetadata = {
  reviewType: "Scorecard",
  status: "pending",
  submittedOn: "",
  reviewedOn: "",
  comments: "",
  isLocked: true,
};

export const defaultWeights: IPerspectiveWeights = {
  financial: 25,
  customer: 25,
  process: 25,
  growth: 25,
};

export const defaultScorecardMetadata: IScorecardMetadata = {
  uid: "",
  displayName: "",
  department: "",
  departmentName: "",
  agreementDraft: {
    reviewType: "Scorecard",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter1Review: {
    reviewType: "Q1 Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter2Review: {
    reviewType: "Midterm Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter3Review: {
    reviewType: "Q3 Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter4Review: {
    reviewType: "Assessment",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  perspectiveWeights: defaultWeights,
  midtermRated: false,
  assessmentRated: false,
};

export interface IPerspectiveWeights {
  financial: number | null;
  customer: number | null;
  process: number | null;
  growth: number | null;
}

export interface IScorecardCycleMetadata {
  reviewType: IReviewCycleType;
  comments?: string;
  submittedOn: string;
  reviewedOn: string;
  status: IReviewCycleStatus;
  isLocked: boolean;
}

export interface IScorecardMetadata {
  uid: string;
  displayName: string;
  department: string;
  departmentName: string;
  perspectiveWeights: IPerspectiveWeights;
  agreementDraft: IScorecardCycleMetadata; // draft
  quarter1Review: IScorecardCycleMetadata; // quarter 1 review
  quarter2Review: IScorecardCycleMetadata; // midterm review
  quarter3Review: IScorecardCycleMetadata; // quarter 3 review
  quarter4Review: IScorecardCycleMetadata;
  midtermRated: boolean;
  assessmentRated: boolean;
}

export default class ScorecardMetadata extends Model<IScorecardMetadata> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}

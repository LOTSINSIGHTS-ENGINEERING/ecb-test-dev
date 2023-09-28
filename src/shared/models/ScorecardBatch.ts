import Model from "./Model";

export const defaultDraftReview: IReviewScorecardBatch = {
  reviewType: "Scorecard",
  startDate: "",
  endDate: "",
  status: "pending",
  expectedPercentageResults: 80,
};

export const defaultQuarter1Review: IReviewScorecardBatch = {
  reviewType: "Q1 Reviews",
  startDate: "",
  endDate: "",
  status: "pending",
  expectedPercentageResults: 80,
};

export const defaultMidtermReview: IReviewScorecardBatch = {
  reviewType: "Midterm Reviews",
  startDate: "",
  endDate: "",
  status: "pending",
  expectedPercentageResults: 80,
};

export const defaultQuarter3Review: IReviewScorecardBatch = {
  reviewType: "Q3 Reviews",
  startDate: "",
  endDate: "",
  status: "pending",
  expectedPercentageResults: 80,
};

export const defaultFinalAssessment: IReviewScorecardBatch = {
  reviewType: "Assessment",
  startDate: "",
  endDate: "",
  status: "pending",
  expectedPercentageResults: 80,
};

export const defaultBatch: IScorecardBatch = {
  id: "",
  active: false,
  current: false,
  locked: false,
  description: "",
  draftReview: defaultDraftReview,
  quarter1Review: defaultQuarter1Review,
  midtermReview: defaultMidtermReview,
  quarter3Review: defaultQuarter3Review,
  finalAssessment: defaultFinalAssessment,
};

export type IReviewCycleType =
  | "Scorecard"
  | "Q1 Reviews"
  | "Midterm Reviews"
  | "Q3 Reviews"
  | "Assessment";

export type IReviewCycleStatus =
  | "pending"
  | "in-progress"
  | "reverted"
  | "submitted"
  | "approved"
  | "cancelled"
  | "completed"
  | "overdue";

export interface IReviewScorecardBatch {
  reviewType: IReviewCycleType;
  description?: string;
  startDate: string;
  endDate: string;
  status: IReviewCycleStatus;
  expectedPercentageResults: number;
}

export interface IScorecardBatch {
  id: string;
  active: boolean;
  current: boolean;
  locked: boolean;
  description: string;

  draftReview: IReviewScorecardBatch; // draft
  quarter1Review: IReviewScorecardBatch; // quarter 1 review
  midtermReview: IReviewScorecardBatch; // midterm review
  quarter3Review: IReviewScorecardBatch; // quarter 3 review
  finalAssessment: IReviewScorecardBatch;
}

export default class ScorecardBatch extends Model<IScorecardBatch> {
  update(): void { }

  edit(): void { }

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}

import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import CompanyScorecardReviewDraftApi from "./CompanyScorecardReviewDraftApi";
import CompanyScorecardReviewQuarter2Api from "./CompanyScorecardReviewQuarter2Api";
import CompanyScorecardReviewQuarter4Api from "./CompanyScorecardReviewQuarter4Api";

export default class CompanyScorecardReviewApi {
  draft: CompanyScorecardReviewDraftApi;
  quarter2: CompanyScorecardReviewQuarter2Api;
  quarter4: CompanyScorecardReviewQuarter4Api;

  constructor(private api: AppApi, private store: AppStore) {
    this.draft = new CompanyScorecardReviewDraftApi(this.api, this.store);
    this.quarter2 = new CompanyScorecardReviewQuarter2Api(this.api, this.store);
    this.quarter4 = new CompanyScorecardReviewQuarter4Api(this.api, this.store);
  }
}

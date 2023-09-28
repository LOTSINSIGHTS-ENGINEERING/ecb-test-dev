// import AppStore from "../stores/AppStore";
// import AppApi from "./AppApi";
// import DivisionScorecardReviewDraftApi from "./DivisionScorecardReviewDraftApi";
// import DivisionScorecardReviewQuarter2Api from "./DivisionScorecardReviewQuarter2Api";
// import DivisionScorecardReviewQuarter4Api from "./DivisionScorecardReviewQuarter4Api";

// export default class DivisionScorecardReviewApi {
//   draft: DivisionScorecardReviewDraftApi;
//   quarter2: DivisionScorecardReviewQuarter2Api;
//   quarter4: DivisionScorecardReviewQuarter4Api;

//   constructor(private api: AppApi, private store: AppStore) {
//     this.draft = new DivisionScorecardReviewDraftApi(this.api, this.store);
//     this.quarter2 = new DivisionScorecardReviewQuarter2Api(
//       this.api,
//       this.store
//     );
//     this.quarter4 = new DivisionScorecardReviewQuarter4Api(
//       this.api,
//       this.store
//     );
//   }
// }
import { runInAction } from "mobx";
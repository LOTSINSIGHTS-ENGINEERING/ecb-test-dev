import AppApi from "../../shared/apis/AppApi";
import AppStore from "../../shared/stores/AppStore";

export async function DuplicateCompanyScorecard(api: AppApi, store: AppStore, prevousScorecardId: string) {
    const currentScorecardId = store.scorecard.current?.id;
   
}
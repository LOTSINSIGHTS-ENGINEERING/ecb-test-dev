import { IDepartment } from "../../../shared/models/Department";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import { IScorecardCycleMetadata, IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import { IUser } from "../../../shared/models/User";
import AppStore from "../../../shared/stores/AppStore";
import { q4FinalRating } from "../../shared/functions/Scorecard";

export function getDepartment(user: IUser, store: AppStore): string {
    const departmentName = store.department.all.find((department) => department.asJson.id === user.department)?.asJson.name;
    if (departmentName) {
        return departmentName;
    } else {
        return "-"
    }
}

export function getFinalWeightedScore(user: IUser, measure: IMeasure[], objective: IObjective[], metaData: IScorecardMetadata[]) {


    const $metaData = metaData.find((m) => m.uid === user.uid);


    if ($metaData) {
        const score = q4FinalRating(measure.filter((m) => m.uid === user.uid), objective.filter((u) => u.uid === user.uid), $metaData);


        if (score) {
            console.log("scores")
            return score
        } else {
            console.log("no scores")
            return 0;
        }
    }


}
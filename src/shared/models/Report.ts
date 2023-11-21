import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IMeasure } from "./Measure";
import Model from "./Model";

export type IDepartmentPeformanceData = {
  id: string;
  departmentName: string;
  avg: number;
  weight: number;
  min: number;
  median: number;
  max: number;
  total: number;
};

export interface IUserPerformanceData {
  uid: string;
  userName: string;
  measures: IMeasure[];
  rating: number;
  rating2: number;
  weight: number;
  weightValidity: boolean;
  department: string;
  departmentName: string;
}

// export default class UserPerformanceData extends Model<IUserPerformanceData> {
//   update(): void { }

//   edit(): void { }

//   async remove() {
//     if (!window.confirm("Continue to delete?")) return;
//   }
// }


export default class UserPerformanceData {
  private userPerformanceData: IUserPerformanceData;

  constructor(private store: AppStore, userPerformanceData: IUserPerformanceData) {
    makeAutoObservable(this);
    this.userPerformanceData = userPerformanceData;
  }

  get asJson(): IUserPerformanceData {
    return toJS(this.userPerformanceData);
  }
}

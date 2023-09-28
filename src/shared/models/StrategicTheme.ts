import Model from "./Model";

export const defaultStrategicTheme: IStrategicTheme = {
  id: "",
  scorecard: "",
  description: "",
  orderNo: 0,
};

export interface IStrategicTheme {
  id: string;
  scorecard: string;
  description: string;
  orderNo: number;
}

export default class StrategicTheme extends Model<IStrategicTheme> {
  update(): void {}

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}

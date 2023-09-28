import Model from "./Model";

export const defaultBusinessUnit: IBusinessUnit = {
  id: "",
  name: "",
};

export interface IBusinessUnit {
  id: string;
  name: string;
}

export default class BusinessUnit extends Model<IBusinessUnit> {

  update(): void {

  }

  edit(): void {}

  async remove() {
    if (!window.confirm("Continue to delete?")) return;
  }
}

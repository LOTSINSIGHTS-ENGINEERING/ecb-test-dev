import { observer } from "mobx-react-lite";
import React from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";
import { IDivision } from "../../../shared/models/Division";

interface IProps {
  division: IDivision;
  setDivision: React.Dispatch<React.SetStateAction<IDivision>>;
}
const DivisionForm = observer((props: IProps) => {
  const { store } = useAppContext();

  const { division, setDivision } = props;

  const departmentOptions = store.department.all.map((bu) => ({
    label: bu.asJson.name,
    value: bu.asJson.id,
  }));

  const onDepartmentChange = (value: string) => {
    const dep = store.department.all.find((dep) => dep.asJson.id === value);

    if (dep)
      setDivision({
        ...division,
        department: value,
        departmentName: dep.asJson.name,
        businessUnit: dep.asJson.businessUnit,
      });
    else
      setDivision({
        ...division,
        department: value,
      });
  };

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="division-fname">
          Name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="division-fname"
            type="text"
            placeholder="Name e.g. ICT"
            value={division.name}
            onChange={(e) => setDivision({ ...division, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="division-department">
          Department
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={departmentOptions}
            name="division-department"
            value={division.department}
            onChange={onDepartmentChange}
            placeholder="Select a business unit"
            required
          />
        </div>
      </div>
    </>
  );
});

export default DivisionForm;

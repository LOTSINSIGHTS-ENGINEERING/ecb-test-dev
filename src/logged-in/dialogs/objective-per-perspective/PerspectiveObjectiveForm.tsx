import { Dispatch, Fragment, SetStateAction, useState } from "react";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";

interface IProps {
  measure: IMeasureCompany;
  setMeasure: Dispatch<SetStateAction<IMeasureCompany>>;
}

export const ObjectiveItem = () => {
  const options = [
    {
      label: "Improve profitability",
      value: "value",
    },
  ];

  return (
    <div>
      <div className="objective--item uk-card uk-card-small">
        <div className="objective--item__content uk-card-body">
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="objective">
              Objective
            </label>
            <div className="uk-form-controls">
              <SingleSelect
                options={options}
                value={options[0].value}
                onChange={(val) => {}}
              />
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="c-objective">
              Contributory Objective
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-textarea uk-form-small"
                placeholder="Contributory Objective"
              />
            </div>
          </div>
        </div>

        <div className="objective--item__controls">
          <button className="btn-icon btn-primary">
            <span data-uk-icon="icon: trash; ratio: 1.2"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const PerspectiveObjectiveForm = (props: IProps) => {
  const { measure, setMeasure } = props;
  const [objectives, setObjectives] = useState([
    "Improve profitability",
    "Make money",
  ]);

  const onAdd = () => {
    setObjectives([...objectives, ""]);
    console.log("Adding...");
  };

  return (
    <Fragment>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-weight">
          Weight
        </label>
        <div className="uk-form-controls">
          <input
            id="kpi-weight"
            className="uk-textarea uk-form-small"
            placeholder="KPI Status Update"
            value={measure.comments}
            onChange={(e) =>
              setMeasure({ ...measure, comments: e.target.value })
            }
          />
        </div>
      </div>

      <div className="objective--list uk-width-1-1 uk-margin">
        <div className="objective--toolbar uk-margin">
          <div>
            <h6>Objectives</h6>
          </div>
          <div>
            <button className="btn btn-primary" onClick={onAdd} type="button">
              <span data-uk-icon="icon: plus; ratio: .8"></span> Add Objective
            </button>
          </div>
        </div>

        {objectives.map((val, index) => (
          <Fragment key={index}>
            <ObjectiveItem />
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default PerspectiveObjectiveForm;

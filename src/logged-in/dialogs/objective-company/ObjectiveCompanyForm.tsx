import React from "react";
import NumberFormat from "react-number-format";
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import StrategicTheme from "../../../shared/models/StrategicTheme";

interface IProps {
  themes: StrategicTheme[];
  objective: IObjectiveCompany;
  setObjective: React.Dispatch<React.SetStateAction<IObjectiveCompany>>;
}
const ObjectiveCompanyForm = (props: IProps) => {
  const { objective, setObjective, themes } = props;

  const options = themes.map((theme) => ({
    value: theme.asJson.id,
    label: theme.asJson.description,
  }));

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="parent-objective-select">
          Strategic theme?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={options}
            value={objective.theme}
            onChange={(val) => setObjective({ ...objective, theme: val })}
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-perspective">
          Perspective
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="objective-perspective"
            value={objective.perspective}
            onChange={(e) =>
              setObjective({ ...objective, perspective: e.target.value })
            }
            required
          >
            <option value={FINANCIAL_TAB.id}>
              {FINANCIAL_TAB.perspective}
            </option>
            <option value={CUSTOMER_TAB.id}>{CUSTOMER_TAB.perspective}</option>
            <option value={PROCESS_TAB.id}>{PROCESS_TAB.perspective}</option>
            <option value={GROWTH_TAB.id}>{GROWTH_TAB.perspective}</option>
          </select>
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-description">
          Objective
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="objective-description"
            rows={2}
            placeholder="Objective description"
            value={objective.description}
            onChange={(e) =>
              setObjective({ ...objective, description: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-weight">
          Weight (%)
        </label>
        <div className="uk-form-controls">
          <NumberFormat
            id="kpi-weight"
            className="uk-input uk-form-small"
            placeholder="Objective weight (%)"
            thousandsGroupStyle="thousand"
            displayType="input"
            decimalSeparator="."
            type="text"
            value={objective.weight}
            onValueChange={(val) =>
              setObjective({ ...objective, weight: val.floatValue || 0 })
            }
            thousandSeparator
            allowNegative
            required
            min={0}
            max={100}
          />
        </div>
      </div>
    </>
  );
};

export default ObjectiveCompanyForm;

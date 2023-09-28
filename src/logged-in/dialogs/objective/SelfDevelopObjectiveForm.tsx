import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect, { IGroupedOption, IOption } from "../../../shared/components/single-select/SingleSelect";
import { GROWTH_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";

interface IGroupedObjective {
  id: string;
  label: string;
  objectives: IObjective[];
}
// group objectives by perspective.
const groupedByPerspective = (objectives: IObjective[]) => {
  const growth = objectives.filter((o) => o.perspective === GROWTH_TAB.id);

  const growthOptions: IGroupedObjective = {
    id: GROWTH_TAB.id,
    label: GROWTH_TAB.name,
    objectives: growth,
  };

  const grouped: IGroupedObjective[] = [growthOptions];
  return grouped;
};

// add a disabled option (perspective) to the options
const categorisedOptions = (groupedObjectives: IGroupedObjective[]) => {
  const options = groupedObjectives.map((group, index) => {
    const disabledOption: IOption = {
      label: group.label.toUpperCase(),
      value: group.id,
      color: "#0052CC",
      isDisabled: true,
    };
    const otherOptions: IOption[] = group.objectives.map((o) => ({
      label: o.description,
      value: o.id,
    }));

    const options = [disabledOption, ...otherOptions];
    return options;
  });

  const _: IOption[] = [];
  return _.concat(...options);
};

interface IProps {
  companyObjectives: IObjective[];
  objective: IObjective;
  setObjective: React.Dispatch<React.SetStateAction<IObjective>>;
}
const SelfDevelopObjectiveForm = (props: IProps) => {
  const { companyObjectives, objective, setObjective } = props;

  const _groupedByPespectiveCompanyOptions =
    groupedByPerspective(companyObjectives);
  const companyOptions = categorisedOptions(_groupedByPespectiveCompanyOptions);

  const options = [...companyOptions];

  const groupedOptions: IGroupedOption[] = [
    {
      label: "Company Objectives",
      options: companyOptions,
    },
  ];

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="parent-objective-select">
          Which strategic human capital objective is this influencing?
          <div className="field-info align-center uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              This is a strategic objective under human capital perspective
              existing at the the company/department level to which individuals
              choose to contribute.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={options}
            groupedOptions={groupedOptions}
            value={objective.parent}
            onChange={(val) => setObjective({ ...objective, parent: val })}
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-contributory">
          Self development objective
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Selft objective is an individual's goal/objective that is aimed
              towards the growth, and improvement of capabilities/skills.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="objective-contributory"
            rows={2}
            placeholder="Describe your self-develop objective"
            value={objective.description}
            onChange={(e) =>
              setObjective({
                ...objective,
                description: e.target.value,
                perspective: GROWTH_TAB.id,
              })
            }
            required
          />
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="objective-weight">
          Weight (%)
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Objective weight is used to prioritize certain objectives over the
              others.
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          {/* <input
            id="objective-weight"
            className="uk-input uk-form-small"
            placeholder="Weight"
            type="number"
            max={100}
            value={objective.weight === null ? "" : objective.weight}
            onChange={(e) =>
              setObjective({
                ...objective,
                weight: NumberInputValue(e.target.value),
              })
            }
          /> */}
          <input
            id="objective-weight"
            className="uk-input uk-form-small"
            type="number"
            min={0}
            max={100}
            placeholder="Objective weight (%)"
            value={objective.weight || 0}
            onChange={(e) =>
              setObjective({
                ...objective,
                weight: Number(e.target.value || 0),
              })
            }
            required
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SelfDevelopObjectiveForm;

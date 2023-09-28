import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect, { IGroupedOption, IOption } from "../../../shared/components/single-select/SingleSelect";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IObjective } from "../../../shared/models/Objective";

interface IGroupedObjective {
  id: string;
  label: string;
  objectives: IObjective[];
}
// group objectives by perspective.
const groupedByPerspective = (objectives: IObjective[]) => {
  const financial = objectives.filter(
    (o) => o.perspective === FINANCIAL_TAB.id
  );
  const customer = objectives.filter((o) => o.perspective === CUSTOMER_TAB.id);
  const process = objectives.filter((o) => o.perspective === PROCESS_TAB.id);
  const growth = objectives.filter((o) => o.perspective === GROWTH_TAB.id);

  const financialOptions: IGroupedObjective = {
    id: FINANCIAL_TAB.id,
    label: FINANCIAL_TAB.name,
    objectives: financial,
  };
  const customerOptions: IGroupedObjective = {
    id: CUSTOMER_TAB.id,
    label: CUSTOMER_TAB.name,
    objectives: customer,
  };
  const processOptions: IGroupedObjective = {
    id: PROCESS_TAB.id,
    label: PROCESS_TAB.name,
    objectives: process,
  };
  const growthOptions: IGroupedObjective = {
    id: GROWTH_TAB.id,
    label: GROWTH_TAB.name,
    objectives: growth,
  };

  const grouped: IGroupedObjective[] = [
    financialOptions,
    customerOptions,
    processOptions,
    growthOptions,
  ];

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
const PerformanceObjectiveForm = (props: IProps) => {
  const { companyObjectives, objective, setObjective } = props;

  // Company options
  const _groupedByPespectiveCompanyOptions = groupedByPerspective(companyObjectives);
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
        <label className="uk-form-label" htmlFor="objective-perspective">
          Perspective
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Perspectives are the performance dimensions, or lenses, that put
              strategy in context. Learning and growth enhance the internal
              capacity of the organization. With enhanced internal capacity, the
              company can focus on enhancing internal processes, which affect
              the external outcomes. The external outcomes are directly linked
              with customers and other stakeholders. Better external outcomes
              will lead to greater customer and stakeholder satisfaction. All
              these combined increase the financial outcome.
            </p>
          </div>
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
        <label className="uk-form-label" htmlFor="parent-objective-select">
          Which departmental strategic objective is this influencing?
          <div className="field-info align-center uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              This is a strategic objective at the the company/department level
              to which individuals choose to contribute.
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
          Contributory objective
          <div className="field-info uk-margin-small-left">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="icon"
              fontSize="xs"
            />
            <p className="description">
              Contributory objective is an individual's goal/objective
            </p>
          </div>
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="objective-contributory"
            rows={2}
            placeholder="Describe your objective"
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

export default PerformanceObjectiveForm;

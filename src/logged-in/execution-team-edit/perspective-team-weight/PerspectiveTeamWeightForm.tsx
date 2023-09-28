import { observer } from "mobx-react-lite";
import React from "react";
import NumberInput, { NumberInputValue } from "../../shared/components/number-input/NumberInput";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import FormFieldInfo from "../../shared/components/form-field-info/FormFieldInfo";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IPerspectiveWeights } from "../../../shared/models/ScorecardMetadata";

interface IProps {
  weights: IPerspectiveWeights;
  setWeights: React.Dispatch<React.SetStateAction<IPerspectiveWeights>>;
}

const PerspectiveWeightForm = observer((props: IProps) => {
  const { weights, setWeights } = props;

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Weight of {FINANCIAL_TAB.perspective} Perspective
          <FormFieldInfo>
            {`Specify the weights of the ${FINANCIAL_TAB.description}`}
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <NumberInput
            id="kpi-baseline"
            className="uk-input uk-form-small"
            placeholder="Weight (%)"
            value={weights.financial}
            onChange={(value) =>
              setWeights({ ...weights, financial: NumberInputValue(value) })
            }
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Weight of {CUSTOMER_TAB.perspective} Perspective
          <FormFieldInfo>
            {`Specify the weights of the ${CUSTOMER_TAB.description}`}
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <NumberInput
            id="kpi-baseline"
            className="uk-input uk-form-small"
            placeholder="Weight (%)"
            value={weights.customer}
            onChange={(value) =>
              setWeights({ ...weights, customer: NumberInputValue(value) })
            }
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Weight of {PROCESS_TAB.perspective} Perspective
          <FormFieldInfo>
            {`Specify the weights of the ${PROCESS_TAB.description}`}
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <NumberInput
            id="kpi-baseline"
            className="uk-input uk-form-small"
            placeholder="Weight (%)"
            value={weights.process}
            onChange={(value) =>
              setWeights({ ...weights, process: NumberInputValue(value) })
            }
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Weight of {GROWTH_TAB.perspective} Perspective
          <FormFieldInfo>
            {`Specify the weights of the ${GROWTH_TAB.description}`}
          </FormFieldInfo>
        </label>
        <div className="uk-form-controls">
          <NumberInput
            id="kpi-baseline"
            className="uk-input uk-form-small"
            placeholder="Weight (%)"
            value={weights.growth}
            onChange={(value) =>
              setWeights({ ...weights, growth: NumberInputValue(value) })
            }
          />
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default PerspectiveWeightForm;

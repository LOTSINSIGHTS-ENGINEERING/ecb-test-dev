import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react-lite";
import { dataTypeSymbol, } from "../../shared/functions/Scorecard";
import { IMeasure } from "../../../shared/models/Measure";
import NumberInput, { NumberInputValue, } from "../../shared/components/number-input/NumberInput";

interface IProps {
  measure: IMeasure;
  setMeasure: Dispatch<SetStateAction<IMeasure>>;
}
const MeasureUpdateQ2ActualForm = observer((props: IProps) => {
  const { measure, setMeasure } = props;
  const dataType = measure.dataType;

  const dateFormat = (dateMillis: number) => {
    const date = new Date(dateMillis || Date.now());
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // append 0 if month or day is less than 10
    const mn = `${month < 10 ? `0${month}` : month}`;
    const dy = `${day < 10 ? `0${day}` : day}`;

    return `${year}-${mn}-${dy}`;
  };

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-description">
          Measure/KPI
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="kpi-description"
            placeholder="KPI description"
            value={measure.description}
            onChange={(e) =>
              setMeasure({ ...measure, description: e.target.value })
            }
            required
            disabled
          />
        </div>
      </div>

      {dataType !== "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-actual">
            Progress update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <NumberInput
              id="kpi-actual"
              className="uk-input uk-form-small"
              placeholder="KPI actual"
              value={measure.quarter2Actual}
              onChange={(value) =>
                setMeasure({
                  ...measure,
                  quarter2Actual: NumberInputValue(value),
                  quarter4Actual: NumberInputValue(value),
                  annualActual: NumberInputValue(value),
                })
              }
            />
          </div>
        </div>
      )}

      {dataType === "Date" && (
        <div className="uk-width-1-1">
          <label className="uk-form-label" htmlFor="kpi-actual">
            Progress Update ({dataTypeSymbol(dataType).symbol})
          </label>
          <div className="uk-form-controls">
            <input
              id="kpi-baseline"
              className="uk-input uk-form-small"
              placeholder="KPI Actual"
              type="date"
              value={dateFormat(measure.quarter2Actual || Date.now())}
              onChange={(e) =>
                setMeasure({
                  ...measure,
                  quarter2Actual: new Date(e.target.value).getTime(),
                  quarter4Actual: new Date(e.target.value).getTime(),
                  annualActual: new Date(e.target.value).getTime(),
                })
              }
            />
          </div>
        </div>
      )}

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-comments">
          Comments
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-comments"
            rows={3}
            placeholder="KPI comments"
            value={measure.midtermComments}
            onChange={(e) =>
              setMeasure({ ...measure, midtermComments: e.target.value })
            }
          />
        </div>
      </div>
    </>
  );
});

export default MeasureUpdateQ2ActualForm;

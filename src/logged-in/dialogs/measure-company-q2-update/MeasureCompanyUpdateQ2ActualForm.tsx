import { Dispatch, Fragment, SetStateAction } from "react";
import { observer } from "mobx-react-lite";
import { dataTypeSymbol } from "../../shared/functions/Scorecard";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import NumberFormat from "react-number-format";

interface IProps {
  measure: IMeasureCompany;
  setMeasure: Dispatch<SetStateAction<IMeasureCompany>>;
}
const MeasureCompanyUpdateQ2ActualForm = observer((props: IProps) => {
  const { measure, setMeasure } = props;
  const dataType = measure.dataType;

  const dateCss = {
    fontSize: "0.7em",
  };

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
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-description"
            rows={2}
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
        <Fragment>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-q2">
              Midterm Actual({dataTypeSymbol(dataType).symbol})
            </label>
            <div className="uk-form-controls">
              <NumberFormat
                id="kpi-q2"
                className="uk-input uk-form-small"
                placeholder="KPI Midterm"
                thousandsGroupStyle="thousand"
                displayType="input"
                decimalSeparator="."
                type="text"
                value={measure.quarter2Actual}
                onValueChange={(val) =>
                  setMeasure({
                    ...measure,
                    quarter2Actual: val.floatValue || 0,
                    quarter4Actual: val.floatValue || 0,
                    annualActual: val.floatValue || 0,
                  })
                }
                thousandSeparator
                allowNegative
              />
            </div>
          </div>

        </Fragment>
      )}

      {dataType === "Date" && (
        <Fragment>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="kpi-q2">
              Midterm Actual({dataTypeSymbol(dataType).symbol})
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                style={dateCss}
                id="kpi-max"
                type="date"
                value={dateFormat(measure.quarter2Actual || 0)}
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
        </Fragment>
      )}
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-comments">
          Status Update
        </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea uk-form-small"
            id="kpi-comments"
            rows={3}
            placeholder="KPI Status Update"
            value={measure.comments}
            onChange={(e) =>
              setMeasure({ ...measure, comments: e.target.value })
            }
          />
        </div>
      </div>
    </>
  );
});

export default MeasureCompanyUpdateQ2ActualForm;
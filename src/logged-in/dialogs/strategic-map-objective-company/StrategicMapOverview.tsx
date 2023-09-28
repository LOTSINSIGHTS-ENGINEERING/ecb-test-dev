import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import { currencyFormat } from "../../../shared/functions/Directives";
import { IMeasure } from "../../../shared/models/Measure";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import Objective, { IObjective } from "../../../shared/models/Objective";
import Rating, { BarRating } from "../../shared/components/rating/Rating";
import { dataTypeSymbol, totalQ4CompanyObjectiveRating, totalQ4IndividualObjectiveRating } from "../../shared/functions/Scorecard";
import { dateFormat } from "../../shared/utils/utils";
import StatusDirection from "./StatusDirection";

interface IContributoryObjectiveProps {
  objective: Objective;
}
const ContributoryObjective: React.FC<IContributoryObjectiveProps> = observer(({ objective }) => {
  const { api, store } = useAppContext();
  const scorecard = store.scorecard.active;
  const [loading, setLoading] = useState(false);

  const department = store.department.getItemById(objective.asJson.department);
  const departmentName = department ? department.asJson.name : "Unknown";

  const calculateRating = (objective: IObjective) => {
    const measures = getMeasures(objective);
    const rating = totalQ4IndividualObjectiveRating(measures);
    return rating;
  };

  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  };

  const loadContributoryObjectiveMeasures = useCallback(async () => {
    if (!scorecard) return;
    setLoading(true);
    try {
      await api.measure.getAllByObjectiveId(objective.asJson.id);
    } catch (error) { }
    setLoading(false);
  }, [api.measure, objective.asJson.id, scorecard]);

  useEffect(() => {
    loadContributoryObjectiveMeasures();
  }, [loadContributoryObjectiveMeasures]);

  return (
    <div>
      <div className="score uk-card uk-card-default uk-card-body uk-card-small">
        <h6 className="sub-heading">
          {/* <span className="department-name">Department: </span>
          {departmentName}
          <hr
            style={{
              marginTop: 5,
              marginBottom: 5,
            }}
          /> */}
          <span className="objective-name">Objective: </span>
          {objective.asJson.description}
        </h6>

        {!loading && (
          <div
            className="uk-grid-small uk-child-width-1-2 uk-grid-match uk-margin"
            data-uk-grid
            style={{ marginBottom: "30px" }}
          >
            <div>
              <div className="rating-container">
                <BarRating rating={calculateRating(objective.asJson)} />
              </div>
            </div>
            <div>
              <div className="rating-container">
                <Rating rate={calculateRating(objective.asJson)} simple={true} />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="rating-container uk-margin">
            <LoadingEllipsis />
          </div>
        )}
      </div>
    </div>
  );
}
);

interface IContributoryObjectivesProps {
  individulalObjectives: Objective[];
}
const ContributoryObjectives = observer((props: IContributoryObjectivesProps) => {
  const { individulalObjectives } = props;

  return (
    <ErrorBoundary>
      <div className="contributory-objectives">
        <div className="uk-flex uk-flex-middle">
          <h5 className="heading uk-margin-remove-bottom uk-margin-right">
            Contributory Objectives
          </h5>
        </div>

        <ErrorBoundary>
          {individulalObjectives.length !== 0 && (
            <div
              className="uk-grid-small uk-child-width-1-2@m uk-child-width-1-3@l uk-grid-match uk-margin"
              data-uk-grid
              style={{ marginBottom: "30px" }}
            >
              {individulalObjectives.map((objective) => (
                <ErrorBoundary key={objective.asJson.id}>
                  <ContributoryObjective objective={objective} />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </ErrorBoundary>
        <ErrorBoundary>
          {individulalObjectives.length === 0 && (
            <div className="uk-width-1-1">
              <div className="uk-card uk-card-default uk-card-small uk-card-body">
                No contributory objectives 😔
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
);

interface IProps {
  objective: IObjective;
}
const StrategicMapOverview = observer((props: IProps) => {
  const { store } = useAppContext();
  const { objective } = props;

  const [measures, setMeasures] = useState<IMeasureCompany[]>([]);

  const individulalObjectives = store.objective.all.filter((o) => o.asJson.parent === objective.id);

  const formatValue = (value: any, dataType: string) => {
    if (dataType === "Date") return dateFormat(value);
    if (dataType === "Currency") return currencyFormat(value);
    return value;
  };

  const calculateRating = () => {
    const rating = totalQ4CompanyObjectiveRating(measures);
    return rating || 0;
  };

  // Get measures that belong to objective
  const getMeasures = useCallback((): IMeasureCompany[] => {
    return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  }, [objective.id, store.companyMeasure.all]);

  useEffect(() => {
    setMeasures(getMeasures());
  }, [getMeasures]);

  return (
    <div className="strategic-map-overview uk-margin">
      <div className="grid uk-margin">
        <div className="kpis uk-card uk-card-default uk-card-small uk-card-body uk-width-expand">
          <h6 className="sub-heading">KPIs</h6>
          <table className="kpis-table uk-table uk-table-justify uk-table-divider uk-table-hover">
            <thead>
              <tr>
                <th>KPIs</th>
                <th>Target</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <tr key={measure.id}>
                  <td className="kpi-name">{measure.description}</td>

                  {measure.dataType !== "Currency" && (
                    <ErrorBoundary>
                      <td className="kpi-target">
                        {dataTypeSymbol(measure.dataType).prefix}
                        {formatValue(measure.annualTarget, measure.dataType)}
                        {dataTypeSymbol(measure.dataType).suffix}
                      </td>
                      <td className="kpi-actual">
                        <StatusDirection rating={measure.rating} />
                        {dataTypeSymbol(measure.dataType).prefix}
                        {formatValue(measure.annualActual, measure.dataType)}
                        {dataTypeSymbol(measure.dataType).suffix}
                      </td>
                    </ErrorBoundary>
                  )}

                  {measure.dataType === "Currency" && (
                    <ErrorBoundary>
                      <td className="kpi-target">
                        {formatValue(measure.annualTarget, measure.dataType)}
                      </td>
                      <td className="kpi-actual">
                        <StatusDirection rating={measure.rating} />
                        {formatValue(measure.annualActual, measure.dataType)}
                      </td>
                    </ErrorBoundary>
                  )}
                </tr>
              ))}
              {measures.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="uk-text-center">
                      <h5>No KPIs found for this objective</h5>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="score uk-card uk-card-default uk-card-body uk-card-small">
          <h6 className="sub-heading">Rating</h6>
          <div className="rating-container uk-margin">
            <Rating rate={calculateRating()} simple={false} />
          </div>
        </div>
      </div>
      <ContributoryObjectives individulalObjectives={individulalObjectives} />
    </div>
  );
});

export default StrategicMapOverview;

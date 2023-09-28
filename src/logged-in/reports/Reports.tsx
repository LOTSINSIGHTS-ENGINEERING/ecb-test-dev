import { useCallback, useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import PeopleTabContent from "./people-tab-content/PeopleTabContent";
import ReportTabs from "./ReportTabs";
import StrategyTabContent from "./strategy-tab-content/StrategyTabContent";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { IMeasure } from "../../shared/models/Measure";
import { IUserPerformanceData } from "../../shared/models/Report";
import { IUser } from "../../shared/models/User";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { DepartmentsTabContent } from "./department-tab-content/DepartmentsTabContent";
import { totalQ2MeasureRating, totalQ4MeasureRating } from "../shared/functions/Scorecard";
import { IScorecardBatch } from "../../shared/models/ScorecardBatch";

const Reports = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  const [loading, setLoading] = useState(false);

  const fyid = store.scorecard.activeId;

  useTitle("KPI Reports");
  useBackButton();

  const measures = store.measure.all.map((measure) => measure.asJson);
  const departments = store.department.all.map((dep) => dep.asJson);
  const users = store.user.all.map((user) => user.asJson);

  const onSelect = (scorecard: IScorecardBatch) => {
    store.measure.removeAll();
    store.objective.removeAll();
    store.companyMeasure.removeAll();
    store.companyObjective.removeAll()

    store.scorecard.setActive(scorecard);
  };

  // verify the measures weight per user add up to 100
  const verifyTotalWeight = (measures: IMeasure[]) => {
    const weight = totalWeight(measures);
    if (weight !== 100) return false;
    return true;
  };

  // total weight per user add up to 100
  const totalWeight = (measures: IMeasure[]) => {
    const totalWeight = measures.reduce((acc, measure) => {
      return acc + (measure.weight || 0);
    }, 0);
    return totalWeight;
  };

  const userMeasures = (measures: IMeasure[], user: IUser) => {
    return measures.filter((measure) => measure.uid === user.uid);
  };

  // resolve the department name from the department id
  const getDepartmentNameFromId = (departmentId: string) => {
    const department = departments.find((department) => department.id === departmentId);
    return department ? department.name : "";
  };

  const userPerformanceData = useCallback(() => {
    const data: IUserPerformanceData[] = [];
    for (const user of users) {
      if (user.devUser) continue;
      // get user measures
      const $measures = userMeasures(measures, user);
      // get department name from department id
      const departmentName = getDepartmentNameFromId(user.department);
      // calculate the rating for each user
      const rating = totalQ2MeasureRating($measures);

      const rating2 = totalQ4MeasureRating($measures);

      // verify the measures weight per user add up to 100
      const weightValidity = verifyTotalWeight($measures);
      // weight value
      const weight = totalWeight($measures);

      // user performance data
      const userPerformanceData: IUserPerformanceData = {
        measures: $measures,
        weightValidity,
        departmentName,
        rating,
        rating2,
        uid: user.uid,
        userName: user.displayName || "",
        weight,
        department: user.department,
      };
      data.push(userPerformanceData);
    }

    // load to report store
    store.report.loadUserPerformanceData(data);
  }, [measures, users, verifyTotalWeight]);

  useEffect(() => {
    userPerformanceData();
  }, [userPerformanceData]);

  // load users from db
  const loadAll = useCallback(async () => {
    setLoading(true); // start loading
    try {
      await api.user.getAll();
      await api.department.getAll();
      await api.measure.getAll();
      await api.objective.getAll();
      if (fyid) {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
      }

      await api.scorecard.getAll();
    } catch (error) { }
    setLoading(false); // stop loading
  }, [api.user, api.department, api.measure, api.objective, api.scorecard, api.companyMeasure, api.companyObjective, fyid]);

  useEffect(() => {
    loadAll();
    return () => { };
  }, [loadAll]);

  return (
    <ErrorBoundary>
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <ReportTabs selectedTab={selectedTab} setselectedTab={setselectedTab} />
          </ErrorBoundary>
          <div className="uk-inline fy-sector">
            <button className="fy-button uk-button uk-button-default" type="button">Select FY</button>
            <div data-uk-dropdown="mode: click">
              {store.scorecard.all.map((batch) => (
                <ScorecardItem
                  key={batch.asJson.id}
                  activeScorecard={store.scorecard.active}
                  scorecard={batch.asJson}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && selectedTab === "strategy-tab" && (<StrategyTabContent />)}
            {!loading && selectedTab === "department-tab" && (<DepartmentsTabContent />)}
            {!loading && selectedTab === "people-tab" && <PeopleTabContent />}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default Reports;

interface IScorecardItemProps {
  activeScorecard: IScorecardBatch | null;
  scorecard: IScorecardBatch;
  onSelect: (scorecard: IScorecardBatch) => void;
}
const ScorecardItem = observer((props: IScorecardItemProps) => {
  const { activeScorecard, scorecard, onSelect } = props;
  const { active, description } = scorecard;

  const activeCss = activeScorecard && activeScorecard.id === scorecard.id ? "active" : "";
  const currentCss = active ? "current" : "";

  const toggleActive = () => {
    onSelect(scorecard);
  };

  return (
    <div className={`fy-report-item uk-card uk-card-default uk-card-small ${activeCss} ${currentCss}`} onClick={toggleActive} >
      <h6 className="description">{description}</h6>
    </div>
  );
});
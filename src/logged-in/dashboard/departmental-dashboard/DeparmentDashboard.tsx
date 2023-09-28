import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import Objective from "../../../shared/models/Objective";
import Measure, { IMeasure } from "../../../shared/models/Measure";
import User from "../../../shared/models/User";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import BarGraph from "../../../shared/components/graph-components/BarGraph";
import { totalQ2MeasureRating, totalQ4MeasureRating } from "../../shared/functions/Scorecard";

const MetricsAnalytics = observer(() => {
  const { store } = useAppContext();
  const department = store.auth.department;
  const measures = store.measure.all;
  const objectives = store.objective.all;
  const users = store.user.departmentalUsers;

  const get_userId = useMemo(() => {
    let _users: User[] = [];
    _users = [...users.filter((u) => {
      return u.asJson.department === department;
    }),];
    const user_id = _users.map((u) => u.asJson.uid);
    return user_id;
  }, [users]);

  const _measures = useMemo(() => {
    let _measuresArray: Measure[] = [];
    get_userId.map((uid) => {
      for (const measure of measures) {
        if (measure.asJson.uid === uid) {
          _measuresArray.push(measure);
        }
      }
    });
    return _measuresArray;
  }, [measures]);

  const _objectives = useMemo(() => {
    let _objectivesArray: Objective[] = [];
    get_userId.map((uid) => {
      for (const objective of objectives) {
        if (objective.asJson.uid === uid) {
          _objectivesArray.push(objective);
        }
      }
    });
    return _objectivesArray;
  }, [objectives]);

  const red_measures = _measures.filter((measure) => Number(measure.asJson.finalRating2 || 0) <= 2);
  const good_measures = _measures.filter((measure) => Number(measure.asJson.finalRating2 || 0) >= 3);
  const $measures = _measures.map((measure) => measure.asJson);

  const rating = totalQ2MeasureRating($measures);
  const rating2 = totalQ4MeasureRating($measures);

  const midtermCss = rating <= 2 ? "warning" : "primary";
  const finalCss = rating2 <= 2 ? "warning" : "success";

  const labels = ["Rating 1", "Rating 2", "Rating 3", "Rating 4", "Rating 5"];

  const q4a_rating = _measures.reduce((acc, val) => {
    const rate = val.asJson.autoRating2 || 0;
    const rating = Math.floor(rate);
    const pos = rating - 1;
    acc[pos] = acc[pos] + 1;
    return acc;
  }, [0, 0, 0, 0, 0]);

  const q4s_rating = _measures.reduce((acc, val) => {
    const rate = val.asJson.supervisorRating2 || 0;
    const rating = Math.floor(rate);
    const pos = rating - 1;
    acc[pos] = acc[pos] + 1;
    return acc;
  }, [0, 0, 0, 0, 0]);

  const q4f_rating = _measures.reduce((acc, val) => {
    const rate = val.asJson.finalRating2 || 0;
    const rating = Math.floor(rate);
    const pos = rating - 1;
    acc[pos] = acc[pos] + 1;
    return acc;
  }, [0, 0, 0, 0, 0]);

  return (
    <>
      <div
        className="uk-grid-small uk-grid-match uk-child-width-1-4@s uk-child-width-1-4@m uk-margin"
        data-uk-grid
        style={{ marginBottom: "30px" }} >
        <div>
          <div className="info-card info-card--primary  uk-card uk-card-default uk-card-small">
            <div className="icon" data-tooltip="View all measures">
              <span>✓</span>
            </div>
            <div className="info-body uk-card-body">
              <p className="value">{_measures.length}</p>
              <p className="label">All KPIs</p>
            </div>
          </div>
        </div>
        <div>
          <div className="info-card info-card--danger  uk-card uk-card-default uk-card-small">
            <div
              className="icon"
              data-tooltip="Red measures focuses on poorly performing metrics"
            >
              <span>❗</span>
            </div>
            <div className="info-body uk-card-body">
              <p className="value">{red_measures.length}</p>
              <p className="label">Red KPIs</p>
            </div>
          </div>
        </div>
        <div>
          <div className="info-card info-card--success  uk-card uk-card-default uk-card-small">
            <div
              className="icon"
              data-tooltip="Good measures focuses on good performing metrics"
            >
              <span>✓</span>
            </div>
            <div className="info-body uk-card-body">
              <p className="value">{good_measures.length}</p>
              <p className="label">Good KPIs</p>
            </div>
          </div>
        </div>
        <div>
          <div className="info-card info-card--success  uk-card uk-card-default uk-card-small">
            <div
              className="icon"
              data-tooltip="Total objectives"
            >
              <span>✓</span>
            </div>
            <div className="info-body uk-card-body">
              <p className="value">{_objectives.length}</p>
              <p className="label">Objectives</p>
            </div>
          </div>
        </div>
      </div>
      <div className="uk-width-1-1 uk-margin-bottom">
        <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
          <h5 className="title uk-margin">Quaterly Scores ✓</h5>
          <div className="uk-grid-small uk-child-width-1-3@s uk-child-width-1-3@m uk-margin" data-uk-grid >

            <div>
              <div className={`info-card info-card--${midtermCss}  uk-card uk-card-default uk-card-small`}>
                <div
                  className="icon"
                  data-tooltip="Average midterm score"
                >
                  {midtermCss === "primary" ? <span>✓</span> : <span>❗</span>}
                </div>
                <div className="info-body uk-card-body">
                  <p className="value">{rating.toFixed(2)}</p>
                  <p className="label">Midterm score</p>
                </div>
              </div>
            </div>
            <div>
              <div className={`info-card info-card--${finalCss}  uk-card uk-card-default uk-card-small`}>
                <div
                  className="icon"
                  data-tooltip="Average final score"
                >
                  {finalCss === "success" ? <span>✓</span> : <span>❗</span>}
                </div>
                <div className="info-body uk-card-body">
                  <p className="value">{rating2.toFixed(2)}</p>
                  <p className="label">Final score</p>
                </div>
              </div>
            </div>
            <div>
              <div className={`info-card info-card--primary  uk-card uk-card-default uk-card-small`}>
                <div
                  className="icon"
                  data-tooltip="Total departmental users"
                >
                  <span>✓</span>
                </div>
                <div className="info-body uk-card-body">
                  <p className="value">{users.length}</p>
                  <p className="label">People</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="people-tab-content">
        <div className="uk-grid-small uk-child-width-1-3@l" data-uk-grid>
          <div>
            <div
              className="uk-card uk-card-default uk-card-small uk-card-body"
              style={{ height: 400 }}
            >
              <BarGraph
                title="Assessment E-Rating"
                ylabel="Measures"
                labels={labels}
                data={q4a_rating}
                scales={{ y: { min: 0, max: _measures.length } }}
              />
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-small uk-card-body"
              style={{ height: 400 }}
            >
              <BarGraph
                title="Assessment S-Rating"
                ylabel="Measures"
                labels={labels}
                data={q4s_rating}
                scales={{ y: { min: 0, max: _measures.length } }}
              />
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-small uk-card-body"
              style={{ height: 400 }}
            >
              <BarGraph
                title="Assessment F-Rating"
                ylabel="Measures"
                labels={labels}
                data={q4f_rating}
                scales={{ y: { min: 0, max: _measures.length } }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const DeparmentDashboard = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const department = store.auth.department || "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await api.measure.getAll();
      await api.user.getByDepartment(department);
      await api.objective.getAll();
      setLoading(false);
    };
    load();
  }, [api.measure, api.user, api.objective, department]);

  return (
    <div className="department-dashboard">
      {!loading && <MetricsAnalytics />}
      {loading && <LoadingEllipsis />}
    </div>
  );
});

export default DeparmentDashboard;
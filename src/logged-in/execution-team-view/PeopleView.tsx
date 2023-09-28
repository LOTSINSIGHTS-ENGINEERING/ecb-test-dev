import Toolbar from "../shared/components/toolbar/Toolbar";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { faArchive, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportEmployeeExcelScorecard } from "../shared/functions/Excel";
import { dataFormat } from "../../shared/functions/Directives";
import { fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import Measure from "../../shared/models/Measure";
import Objective from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import NoMeasures from "../execution-scorecard/NoMeasures";
import { IScorecardArchive } from "../../shared/models/ScorecardArchive";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";

interface IMeasureTableItemProps {
  measure: Measure;
}

const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const measure = props.measure.asJson;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  return (
    <tr className="row uk-card">
      <td>
        {measure.description}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.annualTarget, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating1, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating2, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating3, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating4, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating5, dataSymbol)}
      </td>
    </tr>
  );
});

interface IPerformanceAgreementDraftProps {
  measures: Measure[];
}
const MeasureTable = observer((props: IPerformanceAgreementDraftProps) => {
  const { measures } = props;

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th>Measure/KPI</th>
              <th>Baseline</th>
              <th>Anual Target</th>
              <th>Rating 1</th>
              <th>Rating 2</th>
              <th>Rating 3</th>
              <th>Rating 4</th>
              <th>Rating 5</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <ErrorBoundary key={measure.asJson.id}>
                <MeasureTableItem measure={measure} />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>
      )}
      {measures.length === 0 && <NoMeasures />}
    </div>
  );
});

interface IObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
}

const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, children } = props;
  const { perspective, description } = objective.asJson;

  return (
    <ErrorBoundary>
      <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
        <div className="uk-flex uk-flex-middle">
          <h3 className="objective-name uk-width-1-1">
            {description}
            <span className="objective-persepctive uk-margin-small-left">
              {fullPerspectiveName(perspective)}
            </span>
          </h3>
        </div>
        <div className="uk-margin">{children}</div>
      </div>
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  objectives: Objective[]
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { objectives } = props;

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        <ErrorBoundary>
          {objectives.map((objective) => (
            <ObjectiveItem key={objective.asJson.id} objective={objective}>
              <MeasureTable measures={objective.measures} />
            </ObjectiveItem>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          {objectives.length === 0 && (<EmptyError errorMessage="No objective found" />)}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

const PeopleView = observer(() => {
  const { api, store, ui } = useAppContext();
  const { uid } = useParams<string>();

  const me = store.auth.meJson;
  const user = store.user.selected;
  const scorecard = store.scorecard.active;

  const [archiving, setArchiving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, setTitle] = useTitle("People"); // set page title

  const navigate = useNavigate();
  useBackButton("/c/scorecards/people/");
  const agreement = useIndividualScorecard(uid);

  const objectives = store.objective.getByUid(uid!);
  const measures = store.measure.getByUid(uid!);
  const measureAudits = store.measureAudit.getByUid(uid!);

  const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson),] || [];
  const contributoryObjectives = objectives.map((o) => o.asJson) || [];
  const allMeasures = measures.map((o) => o.asJson) || [];

  const deleteObjectives = async () => {
    for (const objective of objectives) {
      await api.objective.delete(objective.asJson);
    }
  };

  const deleteMeasures = async () => {
    for (const measure of measures) {
      await api.measure.delete(measure.asJson);
    }
  };

  const deleteMeasuresAudits = async () => {
    for (const measureAudit of measureAudits) {
      await api.measureAudit.delete(measureAudit.asJson);
    }
  };

  const onArchive = async (archive: IScorecardArchive) => {
    try {
      await api.scorecardaArchive.create(archive);
      await deleteObjectives();
      await deleteMeasures();
      await deleteMeasuresAudits();
      await api.individualScorecard.delete(agreement);
      ui.snackbar.load({
        id: Date.now(),
        message: "Scorecard Archived.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to archive scorecard.",
        type: "danger",
      });
    }
  };

  const onArchiveScorecard = async () => {
    if (!window.confirm("This action cannot be undone, the data will be moved to the archive folder.")) return;
    setArchiving(true)
    const _objectives = objectives.map((o) => o.asJson);
    const _measures = measures.map((m) => m.asJson);
    const _measureAudits = measureAudits.map((m) => m.asJson);

    const $archive: IScorecardArchive = {
      uid: user!.uid,
      displayName: user!.displayName,
      archiverUid: me!.uid,
      archiverDisplayName: me!.displayName,
      objectives: _objectives,
      measures: _measures,
      measureAudits: _measureAudits,
      isLocked: false
    };
    await onArchive($archive)
    setArchiving(false)
  };


  const handleExportPDF = async () => {
    if (!scorecard || !user) return;
    const title = `${user.displayName} ${scorecard.description} Scorecard`;
    try {
      generateIndividualPerformanceAgreementPDF(title, strategicObjectives, contributoryObjectives, allMeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  const handleExportExcel = async () => {
    if (!scorecard || !user) return;
    const title = `${user.displayName} ${scorecard.description} Scorecard`;
    try {
      await exportEmployeeExcelScorecard(title, strategicObjectives, contributoryObjectives, allMeasures);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    const setPageTitle = () => {
      if (!user) navigate("/c/execution/people/");
      else setTitle(`Scorecard for ${user.displayName}`);
    };

    setPageTitle();
  }, [navigate, setTitle, user]);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      setLoading(true); // start loading
      await api.objective.getAll(uid); // load objectives
      await api.measure.getAll(uid); // load measures
      setLoading(false); // end loading
    };
    load();
  }, [api.measure, api.objective, uid]);

  return (
    <ErrorBoundary>
      <div className="people-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    title="Export your scorecard as PDF."
                    onClick={handleExportPDF}>
                    <span data-uk-icon="icon: file-pdf; ratio:.8"></span> Export PDF
                  </button>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    title="Export your scorecard as EXCEL."
                    onClick={handleExportExcel}
                  >
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Export Excel
                  </button>
                  <button
                    className="btn btn-danger uk-margin-small-right"
                    title="Do you want to archive the scorecard."
                    onClick={onArchiveScorecard} >
                    <FontAwesomeIcon
                      icon={faArchive}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Archive
                    {archiving && <div data-uk-spinner="ratio: .5"></div>}
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            {!loading && uid && <StrategicList objectives={objectives} />}
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default PeopleView;
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { fullPerspectiveName, ALL_TAB, FINANCIAL_TAB, CUSTOMER_TAB, PROCESS_TAB, GROWTH_TAB } from "../../shared/interfaces/IPerspectiveTabs";
import { IPerspectiveWeights, IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import { IMeasure } from "../../shared/models/Measure";
import Objective, { IObjective } from "../../shared/models/Objective";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import WeightError from "../shared/components/weight-error/WeightError";
import NoMeasures from "./NoMeasures";
import { dataFormat } from "../../shared/functions/Directives";
import { faPencilAlt, faArrowRightLong, faFileExcel, faFilePdf, faHistory, faArchive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../shared/components/Modal";
import ScorecardModal from "../dialogs/view-past-scorecards/ScorecardModal";

interface IMeasureTableItemProps {
  measure: IMeasure;
}
const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { measure } = props;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";


  return (
    <tr className="row">
      <td>
        {measure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
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

interface IMeasureTableProps {
  measures: IMeasure[];
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures } = props;
  const [isEmpty, setisEmpty] = useState(false);

  useEffect(() => {
    setisEmpty(measures.length === 0 ? true : false);
  }, [measures]);

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {!isEmpty && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Baseline</th>
                <th>Annual Target</th>
                <th>Rate 1</th>
                <th>Rate 2</th>
                <th>Rate 3</th>
                <th>Rate 4</th>
                <th>Rate 5</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <ErrorBoundary key={measure.id}>
                  <MeasureTableItem measure={measure} />
                </ErrorBoundary>
              ))}
            </tbody>
          </table>
        )}

        {isEmpty && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

// Draft Scorecard Content
interface IObjectiveItemProps {
  objective: IObjective;
  totalNoOfMeasures: number;
  children?: React.ReactNode;
  enableEditing: boolean;
  uid: string;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { objective, enableEditing, children, totalNoOfMeasures, uid } = props;
  const { api, store } = useAppContext();
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/c/scorecards/people/${uid}/${objective.id}`)
  };

  const handleMore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.TEAM.TEAM_OBJECTIVE_MODAL);
  };

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!window.confirm("Remove objective?")) return;
    await removeAllMeasures();
    await api.objective.delete(objective);
  };

  const removeAllMeasures = async () => {
    for (const measure of store.measure.all) {
      if (measure.asJson.objective === objective.id) {
        await api.measure.delete(measure.asJson);
      }
    }
  };

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin-small">
      <div className="uk-flex uk-flex-middle">
        <h3 className="objective-name uk-width-1-1">
          {objective.description}
          <div className="uk-margin-small-top"></div>
          <span className="objective-persepctive">
            {fullPerspectiveName(objective.perspective)}
          </span>
          <span className="objective-weight">
            Weight: {objective.weight || 0}%
          </span>
          {objective.objectiveType === "self-development" && (
            <span className="objective-type">PDP</span>
          )}
        </h3>

        <ErrorBoundary>
          <button
            title="More Options"
            className="btn-icon"
            onClick={handleMore}
          >
            <span uk-icon="icon: more-vertical; ratio: .8"></span>
          </button>

          <Dropdown pos="bottom-right">
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleView}
              >
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="list"
                ></span>
                {totalNoOfMeasures ? "View Measures" : "Add Measures"}
              </button>
            </li>
            <li>
              <button className="kit-dropdown-btn" onClick={handleEdit} disabled={enableEditing}>
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="pencil"
                ></span>
                Edit Objective
              </button>
            </li>
            <li>
              <button className="kit-dropdown-btn" onClick={handleRemove} disabled={enableEditing}>
                <span
                  className="uk-margin-small-right"
                  data-uk-icon="trash"
                ></span>
                Remove Objective
              </button>
            </li>
          </Dropdown>
        </ErrorBoundary>
      </div>
      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  tab: string;
  objectives: IObjective[];
  enableEditing: boolean
  perspectiveWeights: IPerspectiveWeights;
  uid: string;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { tab, objectives, enableEditing, perspectiveWeights, uid } = props;
  const { store } = useAppContext();

  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  const handlePerspectiveWeight = () => {
    showModalFromId(MODAL_NAMES.TEAM.TEAM_PERSPECTIVE_MODAL);
  };

  const perspectiveObjectiveGroup = (name: string, filter: string, weight: number | null = 0) => {
    const perpectiveObjectives = objectives.filter((o) => o.perspective === filter);
    const totalWeight = perpectiveObjectives.reduce((acc, curr) => acc + (curr.weight || 0), 0);

    return (
      <div className="objective-group">
        <div className="perspective-weight">
          <span className="name">{name}</span>
          <span className="arrow">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
          <span className="weight">Weight: {weight}%</span>
          <button
            className="btn-edit btn-primary"
            title="Edit the weight."
            onClick={handlePerspectiveWeight}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        </div>

        {perpectiveObjectives.map((objective) => (
          <ErrorBoundary key={objective.id}>
            <ObjectiveItem
              objective={objective}
              enableEditing={enableEditing}
              totalNoOfMeasures={getMeasures(objective).length}
              uid={uid}

            >
              <MeasureTable measures={getMeasures(objective)} />
            </ObjectiveItem>
          </ErrorBoundary>
        ))}
        {/* Empty */}
        {!perpectiveObjectives.length && (
          <div className="uk-margin-small">
            <EmptyError errorMessage="No objectives found for this perspective " />
          </div>
        )}

        {/* Weight Error. */}
        {perpectiveObjectives.length !== 0 && (
          <WeightError weightError={totalWeight} pos="relative">
            The weights of the objectives under {name} don't add up to
          </WeightError>
        )}
      </div>
    );
  };

  if (tab === FINANCIAL_TAB.id)
    return perspectiveObjectiveGroup(
      FINANCIAL_TAB.name,
      FINANCIAL_TAB.id,
      perspectiveWeights.financial
    );
  if (tab === CUSTOMER_TAB.id)
    return perspectiveObjectiveGroup(
      CUSTOMER_TAB.name,
      CUSTOMER_TAB.id,
      perspectiveWeights.customer
    );
  if (tab === PROCESS_TAB.id)
    return perspectiveObjectiveGroup(
      PROCESS_TAB.name,
      PROCESS_TAB.id,
      perspectiveWeights.process
    );
  if (tab === GROWTH_TAB.id)
    return perspectiveObjectiveGroup(
      GROWTH_TAB.name,
      GROWTH_TAB.id,
      perspectiveWeights.growth
    );

  return (
    <>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          FINANCIAL_TAB.name,
          FINANCIAL_TAB.id,
          perspectiveWeights.financial
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          CUSTOMER_TAB.name,
          CUSTOMER_TAB.id,
          perspectiveWeights.customer
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          PROCESS_TAB.name,
          PROCESS_TAB.id,
          perspectiveWeights.process
        )}
      </ErrorBoundary>
      <ErrorBoundary>
        {perspectiveObjectiveGroup(
          GROWTH_TAB.name,
          GROWTH_TAB.id,
          perspectiveWeights.growth
        )}
      </ErrorBoundary>
    </>
  );
});
interface IUserProps {
  uid: string;
  agreement: IScorecardMetadata;
  objectives: Objective[];
  enableEditing: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
  onArchiveScorecard: () => Promise<void>
  archiving: boolean;
}

const IndividualScorecardTeamDraftCycle = observer((props: IUserProps) => {
  const { agreement, objectives, enableEditing, handleExportExcel, handleExportPDF, uid, archiving, onArchiveScorecard } = props;
  const { store } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);

  const handleNewObjective = () => {
    store.objective.setPerspective(tab);
    store.objective.clearSelected();
    showModalFromId(MODAL_NAMES.TEAM.TEAM_OBJECTIVE_MODAL);
  };

  const sortByPerspective = (a: IObjective, b: IObjective) => {
    const order = ["F", "C", "P", "G"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return aIndex - bIndex;
  };

  // const handleScorecards = () => {
  //   showModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_MODAL);
  // };

  const $objectives = useMemo(() => {
    const sorted = objectives.map((o) => o.asJson).sort(sortByPerspective);
    const obj = tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.perspective === tab);
    return obj;
  }, [objectives, tab]);

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={
                <ErrorBoundary>
                  <Tabs tab={tab} setTab={setTab} noMap={true} />
                </ErrorBoundary>
              }
              rightControls={
                <ErrorBoundary>
                  {/* <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleScorecards}
                    title="View past scorecards."
                  >
                    <FontAwesomeIcon
                      icon={faHistory}
                      size="sm"
                      className="icon uk-margin-small-right"
                    />
                    View Past Scorecards
                  </button> */}
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleExportPDF}
                    title="Export your scorecard as PDF."
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Export PDF
                  </button>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleExportExcel}
                    title="Export your scorecard as EXCEL."
                  >
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="lg"
                      className="icon uk-margin-small-right"
                    />
                    Export Excel
                  </button>
                  <button
                    className="btn btn-primary uk-margin-small-right"
                    onClick={handleNewObjective}
                    disabled={enableEditing}
                    title="Add a new objective to your scorecard"
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Objective
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
            <div className="uk-margin">
              <StrategicList
                uid={uid}
                tab={tab}
                objectives={$objectives}
                perspectiveWeights={agreement.perspectiveWeights}
                enableEditing={enableEditing}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.EXECUTION.SCORECARD_MODAL}>
        <ScorecardModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default IndividualScorecardTeamDraftCycle;
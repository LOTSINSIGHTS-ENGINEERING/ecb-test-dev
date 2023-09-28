import { useEffect, useMemo, useState } from "react";
import Toolbar from "../shared/components/toolbar/Toolbar";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { IObjective } from "../../shared/models/Objective";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../shared/hooks/useTitle";
import WeightError from "../shared/components/weight-error/WeightError";
import useBackButton from "../../shared/hooks/useBack";
import React from "react";
import useIndividualScorecard from "../../shared/hooks/useIndividualScorecard";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { defaultMeasure, IMeasure } from "../../shared/models/Measure";
import { dataFormat } from "../../shared/functions/Directives";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import NoMeasures from "./NoMeasures";
const MeasureModal = React.lazy(() => import("../dialogs/measure/MeasureModal"));
const MeasureCommentsModal = React.lazy(() => import("../dialogs/measure-comments/MeasureCommentsModal"));

interface IMeasureTableItemProps {
  measure: IMeasure;
  enableEditing: boolean;
}
const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { api, store } = useAppContext();
  const { measure, enableEditing } = props;

  const [currentMeasure, setCurrentMeasure] = useState<IMeasure>({ ...defaultMeasure });

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const handleEditComments = () => {
    store.measure.select(currentMeasure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL);
  };

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.measure.select(currentMeasure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
  };

  const handleDeleteMeasure = () => {
    if (!window.confirm("Remove measure?")) return;
    api.measure.delete(currentMeasure);
  };

  useEffect(() => {
    setCurrentMeasure({ ...measure });
  }, [measure]);

  return (
    <tr className="row">
      <td>
        {currentMeasure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
        <button
          title="Comments"
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comment; ratio: 1"
        ></button>
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
      <td>
        <div className="controls">
          <button
            title="More Options"
            className="btn-icon"
          >
            <span uk-icon="more"></span>
          </button>
          <Dropdown>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleEditMeasure}
                disabled={enableEditing}
              >
                <span uk-icon="pencil"></span> Edit Measure
              </button>
            </li>
            <li>
              <button
                className="kit-dropdown-btn"
                onClick={handleDeleteMeasure}
                disabled={enableEditing}
              >
                <span uk-icon="trash"></span> Delete Measure
              </button>
            </li>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
});
interface IProps {
  measures: IMeasure[];
  enableEditing: boolean;
}
const MeasureTable = observer((props: IProps) => {
  const { measures, enableEditing } = props;

  return (
    <ErrorBoundary>
      <div className="measure-table">

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <ErrorBoundary key={measure.id}>
                <MeasureTableItem measure={measure} enableEditing={enableEditing} />
              </ErrorBoundary>
            ))}
          </tbody>
        </table>

        {measures.length === 0 && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

interface IStrategicListProps {
  objective: IObjective;
  enableEditing: boolean;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { objective, enableEditing } = props;

  // Get measures that belong to objective
  const measures = useMemo(() => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  }, [store.measure.all]);

  const weight = measures.reduce((acc, curr) => acc + (curr.weight || 0), 0);

  return (
    <ErrorBoundary>
      <div className="objective-measures uk-margin">
        <div className="measures uk-card uk-card-default uk-card-body uk-card-small">
          <MeasureTable measures={measures} enableEditing={enableEditing} />
        </div>
      </div>
      <ErrorBoundary>
        {measures.length !== 0 && (
          <WeightError weightError={weight}>
            The sub-weights of the measures don't add up to
          </WeightError>
        )}
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

const IndividualScorecardDraftObjective = observer(() => {
  const { store } = useAppContext();
  const { id: objectiveId } = useParams();
  const [_, setTitle] = useTitle(); // set page title
  const [objective, setObjective] = useState<IObjective | null>(null);
  const navigate = useNavigate();
  const agreement = useIndividualScorecard();
  const objectives = store.objective.allMe;

  useBackButton("/c/scorecards/my/");

  const enableEditing = useMemo(() => {
    const isEditing = agreement.agreementDraft.status === "pending" || agreement.agreementDraft.status === "in-progress"
    return !isEditing;
  }, [agreement.agreementDraft.status]);

  const handleNewMeasure = () => {
    store.objective.clearSelected(); // clear selected objective
    store.measure.clearSelected(); // clear selected measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
  };

  useEffect(() => {
    const getObjective = () => {
      const objective = objectives.find((o) => o.asJson.id === objectiveId);
      objective ? setObjective(objective.asJson) : navigate("/c/scorecards/my/");
    };
    getObjective();
  }, [objectives, navigate, objectiveId]);

  useEffect(() => {
    const setPageTitle = () => {
      objective ? setTitle(`Individual Scorecard | ${objective.description}`) : setTitle("Individual Scorecard");
    };
    setPageTitle();
  }, [objective, setTitle]);

  return (
    <ErrorBoundary>
      <div className="objective-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewMeasure}
                    disabled={enableEditing}
                  >
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span> New
                    Measure
                  </button>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            {objective && <StrategicList objective={objective} enableEditing={enableEditing} />}
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_MODAL}>
          <MeasureModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MODAL}>
          <MeasureCommentsModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default IndividualScorecardDraftObjective;

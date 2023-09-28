import { useCallback, useEffect, useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import useBackButton from "../../../shared/hooks/useBack";
import useTitle from "../../../shared/hooks/useTitle";
import { IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../../dialogs/ModalName";
import Toolbar from "../../shared/components/toolbar/Toolbar";
import Modal from "../../../shared/components/Modal";
import TeamMeasureModal from "../measure-team-modal/TeamMeasureModal";
import { dataFormat } from "../../../shared/functions/Directives";
import { IMeasure } from "../../../shared/models/Measure";
import WeightError from "../../shared/components/weight-error/WeightError";
import NoMeasures from "../NoMeasures";
import Dropdown from "../../../shared/components/dropdown/Dropdown";
import useIndividualScorecard from "../../../shared/hooks/useIndividualScorecard";

interface IMeasureTableItemProps {
  measure: IMeasure;
  enableEditing: boolean;
}

const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { store, api } = useAppContext();
  const { measure, enableEditing } = props;

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol || "";

  const handleEditMeasure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.TEAM.TEAM_MEASURE_MODAL);
  };

  const handleDeleteMeasure = async () => {
    if (!window.confirm("Remove measure?")) return;
    await api.measure.delete(measure);
  };


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
      <td>
        <div className="controls">
          <button title="More Options" className="btn-icon">
            <span uk-icon="more"></span>
          </button>
          <Dropdown>
            <li>
              <button className="kit-dropdown-btn" onClick={handleEditMeasure} disabled={enableEditing}>
                <span uk-icon="pencil"></span> Edit Measure
              </button>
            </li>
            <li>
              <button className="kit-dropdown-btn" onClick={handleDeleteMeasure} disabled={enableEditing}>
                <span uk-icon="trash"></span> Delete Measure
              </button>
            </li>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
});

interface IMeasureTableProps {
  measures: IMeasure[];
  enableEditing: boolean;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
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

  const measures = useMemo(() => {
    return store.measure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  }, [objective.id, store.measure.all]);

  const weight = measures.reduce((acc, curr) => acc + (curr.weight || 0), 0);




  return (
    <ErrorBoundary>
      <div className="objective-measures">
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


const IndividualScorecardTeamObjective = observer(() => {
  const { store, } = useAppContext();
  const { uid, objectiveId } = useParams();
  const agreement = useIndividualScorecard(uid);
  const objectives = store.objective.getByUid(uid!);

  const [_, setTitle] = useTitle();
  const [objective, setObjective] = useState<IObjective | null>(null);

  const navigate = useNavigate();
  useBackButton(`/c/scorecards/people/${uid}`);

  const enableEditing = useMemo(() => {
    const isEditing = agreement.agreementDraft.status === "pending" || agreement.agreementDraft.status === "in-progress"
    return !isEditing;
  }, [agreement.agreementDraft.status]);

  const handleNewMeasure = () => {
    store.objective.clearSelected();
    store.measure.clearSelected();
    showModalFromId(MODAL_NAMES.TEAM.TEAM_MEASURE_MODAL);
  };

  // Get measures
  const getObjective = useCallback(() => {
    const _objective = objectives.find((o) => o.asJson.id === objectiveId);
    _objective ? setObjective(_objective.asJson) : navigate("/c/scorecards/people/");
  }, [objectives, navigate, objectiveId]);

  const setPageTitle = useCallback(() => {
    objective ? setTitle(`${objective.description}`) : setTitle("-");
  }, [objective, setTitle]);

  useEffect(() => {
    getObjective();
  }, [getObjective]);

  useEffect(() => {
    setPageTitle();
  }, [setPageTitle]);

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
                    disabled={enableEditing}>
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
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.TEAM.TEAM_MEASURE_MODAL}>
              <TeamMeasureModal />
            </Modal>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default IndividualScorecardTeamObjective;
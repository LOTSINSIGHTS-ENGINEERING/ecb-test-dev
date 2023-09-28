import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import NodeRow from "./NodeRow";
import Node from "./Node";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { mission, vision, } from "../../../shared/components/vision-mission/VisionMission";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../../shared/components/Modal";
import MODAL_NAMES from "../../dialogs/ModalName";
import StrategicMapObjectiveModal from "../../dialogs/strategic-map-objective/StrategicMapObjectiveModal";

const StrategicMap = observer(() => {
  const { api, store, ui } = useAppContext();
  const activeId = `${store.scorecard.activeId}`;

  const getObjectivesPerPerspective = (perspective: string) => {
    return store.objective.allMe.filter((objective) => objective.asJson.perspective === perspective).map((objective) => objective.asJson);
  };

  useEffect(() => {
    const loadAll = async () => {
      if (!activeId) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Cannot find strategic objectives.",
          type: "danger",
        });
        return;
      }
      try {
        await api.strategicTheme.getAll(activeId);
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to load data.",
          type: "danger",
        });
      }
    };

    loadAll();
  }, [activeId, api.strategicTheme, ui.snackbar]);

  return (
    <ErrorBoundary>
      <div className="strategic-map uk-card uk-card-default uk-card-body uk-card-small uk-margin-bottom">
        <div className="map">
          <div
            className="uk-child-width-1-2 uk-grid-match uk-grid-small uk-margin-bottom"
            data-uk-grid
          >
            <div>
              <div className=" uk-child-width-1-1" data-uk-grid>
                <div>
                  <div className="vmission uk-card uk-card-body">
                    <p>{vision}</p>
                  </div>
                </div>
                <div className="uk-margin-small-top">
                  <div className=" vmission uk-card uk-card-body">
                    <p>{mission}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="goals uk-card uk-card-body">
                <h3 className="uk-card-title">Strategic Goals</h3>
                <ol>
                  {store.strategicTheme.all.map((theme) => (
                    <li>{theme.asJson.description}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <table className="objectives">
            <tbody>
              <NodeRow perspective={FINANCIAL_TAB.perspective}>
                {getObjectivesPerPerspective(FINANCIAL_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>

              <NodeRow perspective={CUSTOMER_TAB.perspective}>
                {getObjectivesPerPerspective(CUSTOMER_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>
              <NodeRow perspective={PROCESS_TAB.perspective}>
                {getObjectivesPerPerspective(PROCESS_TAB.id).map(
                  (objective) => (
                    <ErrorBoundary key={objective.id}>
                      <Node objective={objective} />
                    </ErrorBoundary>
                  )
                )}
              </NodeRow>
              <NodeRow perspective={GROWTH_TAB.perspective}>
                {getObjectivesPerPerspective(GROWTH_TAB.id).map((objective) => (
                  <ErrorBoundary key={objective.id}>
                    <Node objective={objective} />
                  </ErrorBoundary>
                ))}
              </NodeRow>
            </tbody>
          </table>
        </div>
        <Modal modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL}
          cssClass="uk-modal-container">
          <StrategicMapObjectiveModal />
        </Modal>
      </div>
    </ErrorBoundary>
  );
});

export default StrategicMap;

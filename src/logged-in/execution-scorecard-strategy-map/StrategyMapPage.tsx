import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import StrategicMap from "./strategic-map/StrategicMap";
import Modal from "../../shared/components/Modal";
import MODAL_NAMES from "../dialogs/ModalName";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import StrategicMapObjectiveCompanyModal from "../dialogs/strategic-map-objective-company/StrategicMapObjectiveCompanyModal";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";

const StrategyMapPage = observer(() => {
  const { api, store, ui } = useAppContext();
  const scorecard = store.scorecard.active;

  const [_, setTitle] = useTitle(); // set page title
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      if (!scorecard) return;

      setLoading(true); // start loading
      try {
        await api.department.getAll();
        await api.companyMeasure.getAll(scorecard.id);
        await api.companyObjective.getAll(scorecard.id);
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Failed to load.",
          type: "danger",
        });
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyMeasure,
    api.companyObjective,
    api.department,
    scorecard,
  ]);

  useEffect(() => {
    // set title of active scorecard
    if (scorecard) setTitle(`Strategy Map: ${scorecard.description}`);
    else setTitle("Strategy Map");
  }, [setTitle, scorecard]);

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>{!loading && <StrategicMap />}</ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal
          modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL}
          cssClass="uk-modal-container"
        >
          <StrategicMapObjectiveCompanyModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default StrategyMapPage;

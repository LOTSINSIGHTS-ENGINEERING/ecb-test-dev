import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { ErrorAlert } from "../../../shared/components/alert/Alert";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import useIndividualScorecard from "../../../shared/hooks/useIndividualScorecard";
import { IPerspectiveWeights } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";
import PerspectiveWeightForm from "./PerspectiveWeightForm";

const PerspectiveWeightModal = observer(() => {
  const { api, ui } = useAppContext();
  const agreement = useIndividualScorecard();
  const [weights, setWeights] = useState<IPerspectiveWeights>({
    ...agreement.perspectiveWeights,
  });
  const [loading, setLoading] = useState(false);
  const weightsSum =
    (weights.financial || 0) +
    (weights.customer || 0) +
    (weights.process || 0) +
    (weights.growth || 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      await api.individualScorecard.create({
        ...agreement,
        perspectiveWeights: weights,
      });
      ui.snackbar.load({
        id: Date.now(),
        message: "Weights updated",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update weights.",
        type: "danger",
      });
    }

    setLoading(false); // stop loading
    onCancel();
  };

  const onCancel = () => {
    setWeights({ ...agreement.perspectiveWeights }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.PERSPECTIVE_WEIGHTS_MODAL);
  };

  useEffect(() => {
    const weights = agreement.perspectiveWeights;
    setWeights({ ...weights });
  }, [agreement.perspectiveWeights]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Perspective Weights</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          {weightsSum !== 100 && (
            <ErrorAlert
              msg={`Weights not adding up to 100%. Currently, ${weightsSum}%`}
            ></ErrorAlert>
          )}
          <PerspectiveWeightForm weights={weights} setWeights={setWeights} />
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || weightsSum !== 100}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default PerspectiveWeightModal;

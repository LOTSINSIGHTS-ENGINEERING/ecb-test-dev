import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import MeasureUpdateQ2ActualForm from "./MeasureUpdateQ2ActualForm";
import { IMeasure, defaultMeasure } from "../../../shared/models/Measure";
import { measureQ2Rating } from "../../shared/functions/Scorecard";

const MeasureUpdateQ2ActualModal = observer(() => {
  const { api, store, ui } = useAppContext();

  const [measure, setMeasure] = useState<IMeasure>({ ...defaultMeasure });
  const [loading, setLoading] = useState(false);
  const [isLocked, setisLocked] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get uid from auth
    const me = store.auth.meJson; // my user account
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading

    // update measure uid & displayName
    const $measure: IMeasure = {
      ...measure,
      uid: me.uid,
      userName: me.displayName || "",
      autoRating: measureQ2Rating(measure),
      finalRating: null, // Reset supervisor's final rating.
      supervisorRating: null,
      supervisorRating2: null,
      finalRating2: null,
      isUpdated: measure.quarter2Actual == null ? false : true,
    };

    // if selected measure, update
    const selected = store.measure.selected;
    if (selected) await update($measure);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      if (isLocked)
        await api.measure.update(measure,
          ["annualActual",
            "quarter2Actual",
            "autoRating",
            "finalRating",
            "supervisorRating",
            "supervisorRating2",
            "finalRating2",
            "isUpdated"
          ]);
      else await api.measure.update(measure);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    // reset form
    setMeasure({ ...defaultMeasure });
    // hide modal
    hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_ACTUAL_MODAL);
  };

  useEffect(() => {
    // no selected measure, and no selected objective
    if (!store.measure.selected) {
      hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_UPDATE_ACTUAL_MODAL);
    }

    // if selected measure, set form values
    if (store.measure.selected) setMeasure({ ...store.measure.selected });
  }, [store.measure.selected]);

  useEffect(() => {
    const scorecard = store.scorecard.active; // active/current scorecard
    if (scorecard) setisLocked(scorecard.locked);
  }, [store.scorecard.active]);

  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Measure/KPI Midterm Progress</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <MeasureUpdateQ2ActualForm
            measure={measure}
            setMeasure={setMeasure}
          />

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
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default MeasureUpdateQ2ActualModal;

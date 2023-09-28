import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultDivision, IDivision } from "../../../shared/models/Division";
import MODAL_NAMES from "../ModalName";
import DivisionForm from "./DivisionForm";

const DivisionModal = observer(() => {
  const { api, store } = useAppContext();

  const [division, setDivision] = useState<IDivision>({
    ...defaultDivision,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading

    // if selected division, update
    const selected = store.division.selected;

    if (selected) await update(division);
    else await create(division);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (division: IDivision) => {
    try {
      await api.division.update(division);
    } catch (error) {
    }
  };

  const create = async (division: IDivision) => {
    try {
      await api.division.create(division);
    } catch (error) {
    }
  };

  const onCancel = () => {
    // clear selected division
    store.division.clearSelected();
    // reset form
    setDivision({ ...defaultDivision });
    // hide modal
    hideModalFromId(MODAL_NAMES.ADMIN.DIVISION_MODAL);
  };

  // if selected division, set form values
  useEffect(() => {
    if (store.division.selected) {
      setDivision(store.division.selected);
    }
  }, [store.division.selected]);

  return (
    <div className="division-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Section</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          onSubmit={handleSubmit}
          data-uk-grid
        >
          <DivisionForm division={division} setDivision={setDivision} />

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

export default DivisionModal;

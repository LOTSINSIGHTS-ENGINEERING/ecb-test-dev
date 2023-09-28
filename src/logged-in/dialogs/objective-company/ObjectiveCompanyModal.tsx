import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IObjectiveCompany, defaultObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../ModalName";
import ObjectiveCompanyForm from "./ObjectiveCompanyForm";

const ObjectiveCompanyModal = observer(() => {
  const { api, store } = useAppContext();
  const [objective, setObjective] = useState(defaultObjectiveCompany);
  const [loading, setLoading] = useState(false);
  const scorecardId = store.scorecard.activeId;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const me = store.auth.meJson; //my user account
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading
    const $objective = objective;

    // update objective uid && userName
    $objective.uid = me.uid;
    $objective.userName = me.displayName || "";

    // if selected objective, update
    const selected = store.companyObjective.selected;

    if (selected) await update($objective);
    else await create($objective);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (objective: IObjectiveCompany) => {
    try {
      await api.companyObjective.update(objective);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (objective: IObjectiveCompany) => {
    try {
      await api.companyObjective.create(objective);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    store.companyObjective.clearSelected();
    // reset form
    setObjective({ ...defaultObjectiveCompany });
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  useEffect(() => {
    const loadThemes = async () => {
      await api.strategicTheme.getAll(scorecardId!);
      store.strategicTheme.load();
    };
    loadThemes();
  }, [api.strategicTheme, store.strategicTheme]);

  useEffect(() => {
    // if selected objective, set form values
    if (store.companyObjective.selected)
      setObjective({ ...store.companyObjective.selected, });
    else setObjective({ ...defaultObjectiveCompany });
  }, [store.companyObjective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Objective</h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <ObjectiveCompanyForm
            themes={store.strategicTheme.all}
            objective={objective}
            setObjective={setObjective}
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

export default ObjectiveCompanyModal;

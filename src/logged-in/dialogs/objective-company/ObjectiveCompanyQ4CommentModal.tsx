import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IObjectiveCompany, defaultObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../ModalName";

const ObjectiveQ4CommentModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState<IObjectiveCompany>({ ...defaultObjectiveCompany })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const $objective: IObjectiveCompany = {
      ...objective,
      assessComment: objective.assessComment,
    };
    try {
      setLoading(true);
      await api.companyObjective.update($objective);
    } catch (error) { }
    setLoading(false);
    onCancel();
  };

  const onCancel = () => {
    store.companyObjective.clearSelected()
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_Q4_COMMENT_MODAL);
  };

  useEffect(() => {
    if (store.companyObjective.selected)
      setObjective({ ...store.companyObjective.selected });
    else
      setObjective({ ...defaultObjectiveCompany });
  }, [store.companyObjective.selected]);


  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        title="Close or Cancel"
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Objective Comment</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-form-controls" style={{ width: "100%" }}>
            <textarea
              className="uk-textarea uk-form-small"
              id="objective-comment"
              rows={5}
              placeholder="Comment"
              value={objective.assessComment}
              onChange={(e) =>
                setObjective({ ...objective, assessComment: e.target.value })
              }
            />
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
              disabled={loading}
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

export default ObjectiveQ4CommentModal;

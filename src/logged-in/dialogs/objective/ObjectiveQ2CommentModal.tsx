import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IObjective, defaultObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../ModalName";

const ObjectiveQ2CommentModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState<IObjective>({ ...defaultObjective })


  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const $objective: IObjective = {
  //     ...objective,
  //     midComment: objective.midComment,
  //   };
  //   try {
  //     setLoading(true);
  //     await api.objective.update($objective);
  //   } catch (error) { }
  //   setLoading(false);
  //   onCancel();
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("here")

    const $objective: IObjective = {
      ...objective,
      assessComment: objective.assessComment,
    };
    try {
      setLoading(true);
      await api.objective.update($objective);
      alert("updated")
    } catch (error) {
      console.log("error on saving comment", error)
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  const onCancel = () => {
    setObjective({ ...defaultObjective })
    store.objective.clearSelected()
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_Q2_COMMENT_MODAL);
  };

  useEffect(() => {
    if (store.objective.selected)
      setObjective({ ...store.objective.selected });
    else setObjective({ ...defaultObjective });
  }, [store.objective.selected]);


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
              value={objective.midComment}
              onChange={(e) =>
                setObjective({ ...objective, midComment: e.target.value })
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

export default ObjectiveQ2CommentModal;

import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { defaultObjective, IObjective } from "../../../shared/models/Objective";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";


const ViewObjectiveDraftCommentModal = observer(() => {
  const { store } = useAppContext();
  const [objective, setObjective] = useState<IObjective>({ ...defaultObjective })

  const onCancel = () => {
    setObjective({ ...defaultObjective })
    store.objective.clearSelected()
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_Q4_COMMENT_MODAL);
  };

  useEffect(() => {
    if (store.objective.selected) {
      setObjective(store.objective.selected);
    } else {
      setObjective({ ...defaultObjective })
    }
  }, [store.objective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        title="Close or Cancel"
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onCancel}
      ></button>
      <h4 className="uk-modal-title">Supervisor Comment</h4>
      <div className="dialog-content uk-position-relative">
        <div className="comment">
          <p className="supervisor-comment">{objective.draftComment}</p>
        </div>
        <div className="uk-width-1-1 uk-text-right"></div>
      </div>
    </div>
  );
});

export default ViewObjectiveDraftCommentModal;

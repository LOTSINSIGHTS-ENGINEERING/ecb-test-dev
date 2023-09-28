import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { IObjective, defaultObjective } from "../../../shared/models/Objective";

const ViewObjectiveQ2CommentModal = observer(() => {

  const { store } = useAppContext();
  const [objective, setObjective] = useState<IObjective>({ ...defaultObjective })

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
      ></button>
      <h3 className="uk-modal-title">Supervisor Comment</h3>

      <div className="dialog-content uk-position-relative">
        <div className="comment">
          <p className="supervisor-comment">{objective.midComment}</p>
        </div>
        <div className="uk-width-1-1 uk-text-right"></div>
      </div>
    </div>
  );
});

export default ViewObjectiveQ2CommentModal;

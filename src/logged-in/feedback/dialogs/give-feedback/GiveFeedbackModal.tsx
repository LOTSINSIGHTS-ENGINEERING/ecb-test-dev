import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import { defaultFeedback, IFeedback } from "../../../../shared/models/Feedback.model";
import MODAL_NAMES from "../../../dialogs/ModalName";
import GiveFeedbackCoolForm from "./GiveFeedbackCoolForm";

const GiveFeedbackModal = observer(() => {
  const { api, store } = useAppContext();
  const [optionSelected, setOptionSelected] = useState("");


  const auth = store.auth.meJson;

  const [feedback, setFeedback] = useState<IFeedback>({
    ...defaultFeedback,
  });


  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();
    setLoading(true); // start loading

    const $feedback = feedback;

    // if selected feedback, update
    const selected = store.feedback.selected;

    if (selected) await update($feedback);
    else await create($feedback);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (feedback: IFeedback) => {
    try {
      await api.feedback.update(feedback);
    } catch (error) {
      console.log("Failed to update> Error: ", error);
    }
  };

  const create = async (feedback: IFeedback) => {
    try {
      await api.feedback.create(feedback);
    } catch (error) {
      console.log("Failed to create> Error: ", error);
    }
  };

  const onCancel = () => {
    // clear selected business unit
    store.feedback.clearSelected();
    // reset form
    setOptionSelected("");
    setFeedback({ ...defaultFeedback });
    // hide modal
    hideModalFromId(MODAL_NAMES.FEEDBACK.CREATE);
  };

  // if selected feedback, set form values
  useEffect(() => {
    if (store.feedback.selected) {
      setFeedback(store.feedback.selected);
    }
  }, [store.feedback.selected]);

  return (
    <div className="feedback-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <div className="dialog-content uk-position-relative">
        <GiveFeedbackCoolForm
          feedback={feedback}
          setFeedback={setFeedback}
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
        />

        {/* <button type="submit" className="btn btn-primary uk-margin" onClick={handleSubmit}>Upload</button> */}
      </div>
    </div>
  );
});

export default GiveFeedbackModal;

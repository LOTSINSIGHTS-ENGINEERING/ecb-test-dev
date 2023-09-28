import React, { useState } from "react";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { IFeedback } from "../../../../shared/models/Feedback.model";

interface IProps {
  feedback: IFeedback;
  setFeedback: React.Dispatch<React.SetStateAction<IFeedback>>;
}
const GiveFeedbackForm = (props: IProps) => {
  const { store } = useAppContext();

  const { feedback, setFeedback } = props;
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackFeeling, setFeedbackFeeling] = useState("");
  const currentUser = store.auth?.meJson;

  const onHandleFeedbackType = (value: any) => {
    setFeedback({ ...feedback, message: value });
    setFeedbackType(value);
  }

  const onHandleFeedbackFeeling = (value: any) => {
    setFeedback({ ...feedback, feeling: value });
    setFeedbackFeeling(value);
    console.log(value);

  }

  const feedbackTypeOptionsList = [
    "Unprompted Feedback",
    "Share Ideas",
    "Give Praise",
    "Give Feedback to my Supervisors"
  ];

  const feedbackTypeOptions = feedbackTypeOptionsList.map((feedbackTypeOption) => ({
    label: feedbackTypeOption,
    value: feedbackTypeOption,
  }));

  const feedbackReceiverOptions = store.user.all.map((ur) => ({
    label: ur.asJson.displayName??"",
    value: ur.asJson.uid,
  }));


  const senderOptionsList = [
    "Submit Anonymously",
    "Submit as self"
  ];

  const senderOptions = senderOptionsList.map((senderOption, key) => ({
    label: senderOption,
    value: senderOption,
  }));

  const contextOptionsList = [
    "My work environment",
    "My work load",
    "My manager",
    "My colleagues",
    "Complaint",
    "Other"];

  const contextOptions = contextOptionsList.map((contextOption, key) => ({
    label: contextOption,
    value: contextOption,
  }));

  const feelingOptionsList = [
    "Happy",
    "Anxious",
    "Empowered",
    "Other"];

  const feelingOptions = feelingOptionsList.map((feelingOption, key) => ({
    label: feelingOption,
    value: feelingOption,
  }));

  return (
    <>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="feedback-sender">
          How would you like to submit this feedback?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={senderOptions}
            name="feedback-sender"
            value={feedback.recipient}
            onChange={(value) =>
              setFeedback({ ...feedback, recipient: value })
            }
            placeholder="How would you like to submit this feedback?"
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="feedback-type">
          What type of feedback?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={feedbackTypeOptions}
            name="feedback-type"
            value={feedback.recipient}
            onChange={(value) =>
              setFeedbackType(value)
            }
            placeholder="What type of feedback?"
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="feedback-recipient">
          Who would you like to submit this feedback?
        </label>
        <div className="uk-form-controls">
          <SingleSelect
            options={feedbackReceiverOptions}
            name="feedback-recipient"
            value={feedback.recipient}
            onChange={(value) =>
              setFeedbackType(value)
            }
            placeholder="What type of feedback?"
            required
          />
        </div>
      </div>
      {
        feedbackType === "Unprompted Feedback" &&
        <>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="feedback-context">
              Feedback Context
            </label>
            <div className="uk-form-controls">
              <SingleSelect
                options={contextOptions}
                name="feedback-context"
                value={feedback.context}
                onChange={(value) =>
                  setFeedback({ ...feedback, context: value })
                }
                placeholder="In what context are you providing this feedback?"
                required
              />
            </div>
          </div>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="feedback-feeling">
              How are you feeling?
            </label>
            <div className="uk-form-controls">
              <SingleSelect
                options={feelingOptions}
                name="feedback-feeling"
                value={feedback.feeling}
                onChange={onHandleFeedbackFeeling}
                placeholder="How are you feeling?"
                required
              />
            </div>
          </div>
          {
            feedbackFeeling === "Other" &&
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="feedback-other-feeling">
                Feeling?
              </label>
              <div className="uk-form-controls">
                <textarea
                  className="uk-textarea uk-form-small"
                  id="feedback-other-feeling"
                  placeholder=""
                  value={feedback.message}
                  onChange={(e) =>
                    setFeedback({ ...feedback, message: e.target.value })
                  }
                  required
                >
                </textarea>
              </div>
            </div>
          }
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="feedback-message">
              Feedback Message
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="feedback-message"
                placeholder=""
                value={feedback.message}
                onChange={onHandleFeedbackType}
                required
              >
              </textarea>
            </div>
          </div>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="feedback-message">
              Feedback Message
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="feedback-message"
                placeholder=""
                value={feedback.message}
                onChange={(e) =>
                  setFeedback({ ...feedback, message: e.target.value })
                }
                required
              >
              </textarea>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default GiveFeedbackForm;


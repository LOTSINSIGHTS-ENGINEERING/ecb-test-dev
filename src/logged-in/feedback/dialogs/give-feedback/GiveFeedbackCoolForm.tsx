import React, { FC, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { defaultFeedback, IFeedback } from "../../../../shared/models/Feedback.model";

import giveImage from '../../../../assets/images/feedback/postFeedback.svg';
import empoweredImage from '../../../../assets/images/feedback/feeling/blessed.png';
import anxiousImage from '../../../../assets/images/feedback/feeling/dizzy.png';
import otherImage from '../../../../assets/images/feedback/feeling/feeling.png';
import happyImage from '../../../../assets/images/feedback/feeling/laughing.png';

import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { observer } from "mobx-react-lite";


interface UnprotProps {
  onSetFeedback: (value: any) => void;
  loading: boolean;
}

const Unpromptedfeedback: FC<UnprotProps> = ({ onSetFeedback, loading }) => {
  const [selectedStep, setSelectedStep] = useState("step1");
  const [feeling, setFeeling] = useState("");
  const [message, setMessage] = useState("");
  const [checkfeeling, setCheckFeeling] = useState("");
  const [context, setContext] = useState("");
  const [checkContext, setcheckContext] = useState("");

  const feelings = [
    { name: "happy", icon: happyImage },
    { name: "anixious", icon: anxiousImage },
    { name: "empowered", icon: empoweredImage },
    { name: "other", icon: otherImage }
  ];




  const contexts = [
    { name: "My Work Environment", icon: "" },
    { name: "My Workload", icon: "" },
    { name: "My Manager", icon: "" },
    { name: "My Colleagues", icon: "" },
    { name: "Complains", icon: "" },
    { name: "Other", icon: "" },
  ];

  const handleSubmit = () => {
    const feedback = {
      message, context, feeling
    }

    onSetFeedback(feedback);
  }

  const handleSteps = (step: string) => {
    setFeeling("");
    setCheckFeeling("");
    if (selectedStep === "step1")
      setSelectedStep("step2");
    else
      setSelectedStep("step1")
  }

  const handleSelectedFeeling = (name: string) => {
    setFeeling(name); setCheckFeeling(name);
    if (name !== "other")
      setSelectedStep("step2");
  }

  return (
    <>
      <div>
        {
          selectedStep === "step1" &&
          <div>
            <h4>What are you feeling?</h4>
            <div className="feedback-grid">
              {
                feelings.map((feeling, key) => (
                  <div key={key} onClick={() => { handleSelectedFeeling(feeling.name) }}>
                    <div className="f-card">
                      <div className="f-card-media-top">
                        <img src={feeling.icon} width="80" height="80" alt="icon" />
                      </div>
                      <div className="f-card-body">
                        <span className="f-card-title">{feeling.name}</span>
                      </div>
                    </div>

                  </div>
                ))
              }
            </div>
            <div className="uk-margin">
              {
                checkfeeling === "other" && <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                  <input className="uk-input" onChange={(e: any) => { setFeeling(e.target.value); }} type="text" placeholder="what are you feeling?" aria-label="Input"></input>
                  <button className="btn btn-primary" onClick={() => handleSteps("step2")}>
                    save
                  </button>
                </div>
              }
            </div>
          </div>
        }
      </div>


      {
        selectedStep === "step2" &&
        <div>
          <h4>In what context</h4>
          <div className="f-chip">
            {
              contexts.map((cxt) => (
                <div className={`f-chip-item ${cxt.name === checkContext ? 'active' : ""}`} onClick={() => { setContext(cxt.name); setcheckContext(cxt.name) }}>
                  <div className="f-chip-icon">
                  </div>
                  <div className="f-chip-body">
                    <span>{cxt.name}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <br />
          <div>
            {
              checkContext === "Other" && <div className="uk-margin">
                <input className="uk-input" onChange={(e: any) => { setContext(e.target.value); }} type="text" placeholder="In which context does it belong to?" aria-label="Input"></input>
              </div>
            }
            <div className="uk-margin">
              <textarea className="uk-textarea" onChange={(e: any) => { setMessage(e.target.value); }} rows={4} placeholder="message" aria-label="Textarea"></textarea>
            </div>

            <div className="uk-margin">
              {
                selectedStep === "step2" && <button
                  className="btn btn-primary uk-margin-right"
                  type="button"
                  onClick={() => { handleSteps(selectedStep) }}
                >
                  back
                </button>
              }

              <button
                className="btn btn-primary"
                type="button"
                disabled={loading}
                onClick={handleSubmit}
              >
                Save {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

interface OtherProps {
  onSetFeedback: (value: any) => void;
  selectedStep: string;
  loading: boolean;
}
const Otherfeedback: FC<OtherProps> = ({ onSetFeedback, selectedStep, loading }) => {
  const [feeling, setFeeling] = useState("");
  const [message, setMessage] = useState("");
  const [idea, setIdea] = useState("");
  const [checkIdea, setcheckIdea] = useState("");

  const ideas = [
    { name: "Productivity", icon: "" },
    { name: "Morale", icon: "" },
    { name: "Health and Safety", icon: "" },
    { name: "Customer Service", icon: "" },
    { name: "Revenue", icon: "" },
    { name: "Quality", icon: "" },
    { name: "Other", icon: "" },
  ]

  const handleSubmit = () => {
    const feedback = {
      message, idea, feeling
    }
    onSetFeedback(feedback);
  }

  return (
    <>
      {
        <div>
          {selectedStep === "ideas" && <h4>What do think this will improve?</h4>}

          <div className="f-chip">
            {selectedStep === "ideas" &&
              ideas.map((cxt) => (
                <div className={`f-chip-item ${cxt.name === checkIdea ? 'active' : ""}`} onClick={() => { setIdea(cxt.name); setcheckIdea(cxt.name) }}>
                  <div className="f-chip-icon">
                  </div>
                  <div className="f-chip-body">
                    <span>{cxt.name}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <br />
          <div>
            {
              checkIdea === "Other" && <div className="uk-margin">
                <input className="uk-input" onChange={(e: any) => { setIdea(e.target.value); }} type="text" placeholder="What do think this will improve?" aria-label="Input"></input>
              </div>
            }
            <div className="uk-margin">
              <textarea className="uk-textarea" onChange={(e: any) => { setMessage(e.target.value); }} rows={4} placeholder="message" aria-label="Textarea"></textarea>
            </div>
            <div className="uk-margin">
              <button
                className="btn btn-primary"
                type="button"
                disabled={loading}
                onClick={handleSubmit}
              >
                Save {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </div>
      }

    </>
  );
}

interface IProps {
  feedback: IFeedback;
  setFeedback: React.Dispatch<React.SetStateAction<IFeedback>>;
  setOptionSelected: any;
  optionSelected: string;
}
const GiveFeedbackForm: FC<IProps> = observer(({ feedback, setFeedback, setOptionSelected, optionSelected }) => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);


  const currentUser = store.auth.meJson;
  const [catgeorySelected, setCategorySelected] = useState("");
  const [feelingSelected, setFeelingSelected] = useState("");

  const backToType = () => {
    setFeedback({ ...defaultFeedback });
    setOptionSelected("");
    setCategorySelected("");
  }

  const backToCategory = (value: string) => {
    setFeedback({ ...defaultFeedback });
    setOptionSelected("give");
    setFeelingSelected("");
    setCategorySelected("");
  }

  const onSelectOption = (value: string) => {
    setOptionSelected(value);
  }

  const onSelectCategory = (value: string) => {
    setFeedback({ ...feedback, category: value });
    setCategorySelected(value);
  }

  const onCancel = () => {
    store.feedback.clearSelected();
    setOptionSelected("");
    setFeedback({ ...defaultFeedback });
    hideModalFromId(MODAL_NAMES.FEEDBACK.CREATE);
  };

  const onSetFeedback = (value: any) => {
    setOptionSelected("");
    setCategorySelected("");

    const { category, type } = feedback;
    const $feedback = { ...value, category, type, sender: `${currentUser?.uid}`, dateCreated: new Date().toString() };

    setTimeout(async () => {
      setLoading(true);
      await create($feedback);
      setLoading(false);
      onCancel();
    }, 1000);
  }

  const update = async (feedback: IFeedback) => {
    try {
      await api.feedback.update(feedback);
    } catch (error) {
    }
  };

  const create = async (feedback: IFeedback) => {
    try {
      await api.feedback.create(feedback);
    } catch (error) {
    }
  };

  const catergories = [
    { id: "unprompted", name: "Unprompted", icon: "", description: "Just something I would like to point out" },
    { id: "ideas", name: "Share Ideas", icon: "", description: "I have an idea" },
    { id: "praise", name: "Praise", icon: "", description: "Praise my colleagues publicly" },
    { id: "peers-feedback", name: "Give Feedback to my peers", icon: "", description: "Share feedback with a colleague" },
  ];

  return (
    <>
      {
        optionSelected === ("") &&
        <div className="uk-grid uk-text-center uk-child-width-expand@s" data-uk-grid style={{ cursor: "pointer" }}>
          <div className="uk-width-1-1"><br />
            <div className="uk-card uk-card-default option uk-width-1-1" onClick={() => (
              onSelectOption("give")
            )}>
              <div className="uk-card-media-top">
                <img src={giveImage} alt="" width={200} height={200} />
              </div>
              <div className="uk-card-body">
                <h3 className="uk-card-title">Give Feedback</h3>
                <p>Share your thoughts</p>
              </div>
            </div>
          </div>
        </div>
      }
      {
        optionSelected === ("give") && catgeorySelected === "" &&
        <div>
          <h3 className="uk-align-center">What type of feedback?</h3>
          <div className="feedback-grid">
            {
              catergories.map((catergory, key) => {
                return <div className="f-card" key={key}>
                  <div className="" onClick={() => (
                    onSelectCategory(catergory.id)
                  )}>
                    <div className="f-card-body">
                      <h3 className="uk-card-title">{catergory.name}</h3>
                      <p>{catergory.description}</p>
                    </div>
                  </div>
                </div>
              }
              )
            }
          </div>
          <button className="btn btn-primary uk-margin" onClick={backToType}>Back</button>
        </div>
      }

      {
        optionSelected === ("give") && catgeorySelected === ("unprompted") &&
        <Unpromptedfeedback loading={loading} onSetFeedback={onSetFeedback} />
      }
      {
        optionSelected === ("give") && catgeorySelected === ("ideas") &&
        <Otherfeedback loading={loading} onSetFeedback={onSetFeedback} selectedStep="ideas" />
      }
      {
        optionSelected === ("give") && catgeorySelected === ("praise") &&
        <Otherfeedback loading={loading} onSetFeedback={onSetFeedback} selectedStep="praise" />
      }
      {
        optionSelected === ("give") && catgeorySelected === ("peers-feedback") &&
        <Otherfeedback loading={loading} onSetFeedback={onSetFeedback} selectedStep="peers-feedback" />
      }

    </>
  );
});

export default GiveFeedbackForm;


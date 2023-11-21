import { observer } from "mobx-react-lite";
import { Steps } from "primereact/steps";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import { MAIL_EMAIL, MAIL_FEEDBACK } from "../../shared/functions/mailMessages";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import { defaultFeedback, IFeedback } from "../../shared/models/Feedback.model";
import FeedbackBreadCrumb from "./tabs/feedbackBreadCrumb";

const RequestFeedback: FC = observer(() => {
    const { store, api, ui } = useAppContext();
    const [loading, setLoading] = useState(false);
    const currentUser = store.auth.meJson;

    useTitle("Request Feedback");
    useBackButton("/c/feedback/home");

    const navigate = useNavigate();

    const animatedComponents = makeAnimated();
    const [activeIndex, setActiveIndex] = useState(0);
    const [questions, setQuestions] = useState<number[]>([0]);
    const [feedback, setFeedback] = useState<IFeedback>(defaultFeedback);
    const [questionValue, setQuestionValues] = useState("");

    const users = store.user.all.map(u => u.asJson).map(user => ({ value: user.uid, label: user.displayName }));

    const items = [
        { label: "Feedback", link: "/c/feedback/home" },
        { label: "Request Feedback", link: "/c/feedback/request" }
    ];

    const RequestFeedbackSteps = [
        // { label: 'Feedback to?' },
        { label: 'Feedback from?' },
        { label: 'Questions' }
    ];

    const handleAddQuestion = (position: number) => {
        setQuestions([...questions, position]);
    }

    const getUsersEmail = (users: string[]): string[] => {
        const usersEmails: string[] = users.map(user => {
            return store.user.getItemById(user)?.asJson.email || "";
        });
        return usersEmails;
    }

    const handleSubmit = async () => {
        setLoading(true);
        await api.feedback.create({ ...feedback, date: new Date().toString(), sender: `${currentUser?.uid}`, type: 'request' });

        // Sending Emails
        const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        if (!DEV_MODE) {
            const message = "You have received a feedback request from "
            const { MY_SUBJECT, MY_BODY } = MAIL_FEEDBACK(currentUser?.displayName, message);
            const emails = getUsersEmail(feedback.receivers);

            await api.mail.sendMail(
                emails,
                MAIL_EMAIL,
                MY_SUBJECT,
                MY_BODY
            )
        }

        ui.snackbar.load({ id: 1, message: "Request Sent", type: "success", timeoutInMs: 2000 })
        setLoading(false);
        navigate("/c/feedback/request");
    }



    return (
        <ErrorBoundary>

            <div className="feedback-actions">
                <div>
                    <FeedbackBreadCrumb values={items} />
                </div>
                <br />

                <div className="inner-actions">
                    <Steps model={RequestFeedbackSteps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <div className="feedback-item">
                        {/* {
                            activeIndex === 0 &&
                            <div className="options">
                                <h4 style={{ textAlign: "center" }}>Hi {currentUser?.displayName}, who are you giving feedback to?</h4>
                                <div className="option-select">
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        onChange={(value: any) => setFeedback({ ...feedback, recipient: value.value })}
                                        placeholder="search user"
                                        options={users}
                                        classNamePrefix="select"
                                        defaultValue={users[0]}
                                        isClearable={true}
                                        isRtl={false}
                                        isSearchable={true}
                                        name="recipient"
                                    />
                                </div>

                                <div className="actions-button">
                                    <button onClick={(e) => { setActiveIndex(1); }} className="btn btn-primary">Next</button>
                                </div>
                            </div>
                        } */}
                        {
                            activeIndex === 0 &&
                            <div className="options">
                                {/* <h4 style={{ textAlign: "center" }}>Hi {currentUser?.displayName}, Who do you want feedback from?</h4> */}
                                <h4 style={{ textAlign: "center" }}>Hi, Who do you want feedback from?</h4>
                                {/* <p style={{ textAlign: "center" }}>You can search for people using their name or their email. If they are not a part of your company in Frankli, the request can be still be sent to their email address.</p> */}
                                <div className="option-select">
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        onChange={(value: any) => setFeedback({ ...feedback, receivers: value.map((v: any) => v.value) })}
                                        placeholder="search user"
                                        options={users}
                                        classNamePrefix="select"
                                        defaultValue={users[0]}
                                        isClearable={true}
                                        isRtl={false}
                                        isMulti={true}
                                        isSearchable={true}
                                        name="receivers"
                                    />
                                </div>

                                <div className="actions-button">
                                    {/* <button onClick={(e) => { setActiveIndex(0); }} className="btn btn-primary">Prev</button> */}
                                    <button onClick={(e) => { setActiveIndex(1); }} className="btn btn-primary">Next</button>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 1 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>Ask some specific questions</h4>
                                    {
                                        questions.map((question, key) => (
                                            <div className="uk-margin" key={key + question + "jlsojehkndhsmlddushebjwsks"}>
                                                <span style={{ marginRight: "4px" }}>{key + 1}. </span>
                                                <textarea className="uk-textarea" defaultValue={feedback.questions[key]} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, questions: [...feedback.questions, e.target.value] }); }} placeholder="Enter a question" aria-label="Textarea"></textarea>
                                            </div>
                                        ))
                                    }
                                    <div className="uk-margin">
                                        <button className="btn btn-primary" onClick={() => handleAddQuestion(questions.length + 1)}>Add another question</button>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={handleSubmit}>Submit &nbsp; {loading && <div style={{ color: "black" }} uk-spinner="ratio: .5"></div>}</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </ErrorBoundary >
    )
})

export default RequestFeedback

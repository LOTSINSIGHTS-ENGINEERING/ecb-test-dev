import { observer } from "mobx-react-lite";
import { Steps } from 'primereact/steps';
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeAnimated from 'react-select/animated';
import Select from "react-select";
import empoweredImage from '../../assets/images/feedback/feeling/blessed.png';
import anxiousImage from '../../assets/images/feedback/feeling/dizzy.png';
import otherImage from '../../assets/images/feedback/feeling/feeling.png';
import happyImage from '../../assets/images/feedback/feeling/laughing.png';
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import { defaultFeedback, IFeedback } from "../../shared/models/Feedback.model";
import FeedbackBreadCrumb from "./tabs/feedbackBreadCrumb";
import { MAIL_EMAIL, MAIL_FEEDBACK } from "../../shared/functions/mailMessages";


const GiveFeedbackActions: FC = observer(() => {

    const { id } = useParams();
    const { store, api, ui } = useAppContext();
    const currentUser = store.auth.meJson;
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [feedback, setFeedback] = useState<IFeedback>(defaultFeedback);
    const [active, setActive] = useState("active");
    const [checkfeeling, setCheckFeeling] = useState("");
    const [checkContext, setcheckContext] = useState("");
    const [checkEffect, setcheckEffect] = useState("");
    const animatedComponents = makeAnimated();

    const navigate = useNavigate();

    const users = store.user.all.map(u => u.asJson).map(user => ({ value: user.uid, label: user.displayName }));

    const items = [
        { label: "Feedback", link: "/c/feedback/home" },
        { label: "Give Feedback", link: "/c/feedback/give" },
        { label: `${id} Feedback`, link: `/c/feedback/give/${id}` }
    ];

    useTitle(`Give ${id} Feedback`.toLocaleLowerCase());
    useBackButton("/c/feedback/give");


    const sendMail = async (type: "Idea" | "Praise" | "Peers feedback") => {
        // Sending Emails
        const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        if (!DEV_MODE) {
            const message = `You have received a ${type} from`
            const { MY_SUBJECT, MY_BODY } = MAIL_FEEDBACK(currentUser?.displayName, message);
            const email = store.user.getItemById(feedback.recipient)?.asJson.email;

            await api.mail.sendMail(
                [email!],
                MAIL_EMAIL,
                MY_SUBJECT,
                MY_BODY
            )
        }

        ui.snackbar.load({ id: 1, message: "Feedback saved successfully ", type: "success", timeoutInMs: 2000 })
    }



    if (id === "unprompted") {
        const UnpromptedSteps = [
            { label: 'Choose User' },
            { label: 'Feeling' },
            { label: 'Context' },
            { label: 'Proceed' },
            { label: 'Impact' },
            { label: 'Message' },
            { label: 'Confirmation' }
        ];

        const proceed = [
            { name: "Meet with Hr to discuss", icon: "" },
            { name: "Request external support/advice EAP", icon: "" },
            { name: "No further action", icon: "" },
        ];

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
            { name: "other", icon: "" },
        ];

        const handleFeeling = (feeling: string) => {
            setCheckFeeling(feeling);
            if (feeling !== "other") setActiveIndex(2);
            setFeedback({ ...feedback, feeling: feeling });
        }

        const handleContext = (context: string) => {
            setcheckContext(context);
            if (context !== "other") setActiveIndex(3);
            setFeedback({ ...feedback, context });
        }
        const handleProceed = (proceed: string) => {
            setActiveIndex(4);
            setFeedback({ ...feedback, proceed: proceed });
        }

        const handleSubmit = async () => {
            setLoading(true);
            await api.feedback.create({ ...feedback, date: new Date().toString() });
            setLoading(false);
            ui.snackbar.load({ id: 1, message: "Feedback saved successfully ", type: "success", timeoutInMs: 2000 })
            navigate("/c/feedback/give");
        }

        return (
            <div className="feedback-actions">
                <FeedbackBreadCrumb values={items} />
                <br />
                <div className="inner-actions">
                    <Steps model={UnpromptedSteps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <div className="options">
                        {
                            activeIndex === 0 &&
                            <div>
                                <div className="option-items">
                                    <div className={`o-item ${active}`} onClick={(e) => { setActiveIndex(1); setFeedback({ ...feedback, anonymously: false, sender: `${currentUser?.uid}` }) }}>
                                        <svg width="50px" height="50px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                                            <path d="M3 16V8a5 5 0 015-5h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M16.5 14.5s-1.5 2-4.5 2-4.5-2-4.5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M8.5 10a.5.5 0 110-1 .5.5 0 010 1zM15.5 10a.5.5 0 110-1 .5.5 0 010 1z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        <span><b>Send as Self</b></span>
                                    </div>

                                    <div className={`o-item ${active}`} onClick={(e) => { setActiveIndex(1); setFeedback({ ...feedback, anonymously: true }) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25.67976" height="50.45487" viewBox="0 0 25.67976 50.45487" >
                                            <path d="M4.68693,9.66747c3.08091-5.16971,10.85858-6.52926,14.61671-1.24359,1.69718,2.38702,1.87753,5.75594,.37486,8.28121-.8344,1.40222-2.15318,2.45045-3.33775,3.54408-1.31821,1.21702-2.58213,2.54746-3.43763,4.14014-2.01182,3.74538-2.01362,8.09135-1.85145,12.22747,.12574,3.2069,5.12637,3.22309,5,0-.14015-3.57442-.43244-7.82662,1.88061-10.84131,1.25213-1.63195,3.01218-2.81829,4.38943-4.33737,1.40097-1.54524,2.46783-3.34948,2.97469-5.38491,1.01423-4.0729-.01166-8.37496-2.74906-11.54442C19.91777,1.46419,15.60789-.29805,11.59907,.04161,6.9229,.4378,2.76566,3.12328,.36957,7.14387c-1.65122,2.77071,2.66977,5.28821,4.31735,2.5236h0Z" fill="#01010C" origin="undraw" />
                                            <path d="M15.38521,45.54231l-.56034-.12494c-.3323-.10419-.6646-.11907-.9969-.04465-.33271,.01509-.64254,.11398-.9295,.29667-.29134,.1571-.52515,.37173-.70142,.64389-.22097,.24146-.37013,.52485-.44748,.85018l-.0893,.6646c.0014,.45127,.11518,.87187,.34132,1.2618l.39091,.50597c.31193,.30984,.67966,.52415,1.10317,.64293l.56034,.12494c.3323,.10419,.6646,.11907,.9969,.04465,.33271-.01509,.64254-.11398,.9295-.29667,.29134-.1571,.52515-.37173,.70142-.64389,.22097-.24146,.37013-.52485,.44748-.85018l.0893-.6646c-.0014-.45127-.11518-.87187-.34132-1.2618l-.39091-.50597c-.31193-.30984-.67966-.52415-1.10317-.64293h0Z" fill="#01010C" />
                                        </svg>
                                        <span><b>Send anonymously</b></span>
                                    </div>
                                </div>

                                <div className="actions-button">
                                    <button onClick={(e) => { setActiveIndex(1); }} className="btn btn-primary">Next</button>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 1 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>What are you feeling?</h4>
                                <div className="option-items">
                                    {
                                        feelings.map((feeling, key) => (
                                            <div className="o-item" key={key} onClick={() => { handleFeeling(feeling.name) }}>
                                                <div className="f-card-media-top">
                                                    <img src={feeling.icon} width="80" height="80" alt="icon" />
                                                </div>
                                                <span className="f-card-title">{feeling.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                {
                                    checkfeeling === "other" && <div className="uk-margin feedback-below" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <input className="uk-input" defaultValue={feedback.feeling} onChange={(e: any) => { setFeedback({ ...feedback, feeling: e.target.value }); }} type="text" placeholder="what are you feeling?" aria-label="Input"></input>
                                    </div>
                                }

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Next</button>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 2 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>In What Context?</h4>
                                <div className="option-items">
                                    {
                                        contexts.map((context, key) => (
                                            <div className="o-item" key={key} onClick={() => { handleContext(context.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={context.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{context.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                {
                                    checkContext === "other" && <div className="uk-margin feedback-below" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <input className="uk-input" defaultValue={feedback.context} onChange={(e: any) => { setFeedback({ ...feedback, context: e.target.value }); }} type="text" placeholder="In what context?" aria-label="Input"></input>
                                    </div>
                                }

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(1); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 3 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>How would you like to proceed?</h4>
                                <div className="option-items">
                                    {
                                        proceed.map((proceed, key) => (
                                            <div className="o-item" key={key} onClick={() => { handleProceed(proceed.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={proceed.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{proceed.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(4); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 4 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>How is this impacting you?</h4>
                                <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                    <textarea className="uk-textarea" defaultValue={feedback.impact} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, impact: e.target.value }); }} placeholder="E.g I am finding it hard to focus?" aria-label="Input"></textarea>
                                </div>
                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(5); }}>Next</button>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 5 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>Any Further thoughts on this?</h4>
                                <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                    <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, message: e.target.value }); }} placeholder="Message" aria-label="Textarea"></textarea>
                                </div>
                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(4); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(6); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 6 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>{currentUser?.displayName}, just to confirm</h4>
                                <h5>How are you feeling?</h5>
                                <p>{feedback.feeling}</p>

                                <h5>In What Context?</h5>
                                <p>{feedback.context}</p>

                                <h5>How would you like to proceed?</h5>
                                <p>{feedback.proceed}</p>

                                <h5>How is this impacting you?</h5>
                                <p>{feedback.impact}</p>

                                <h5>Any Further thoughts on this?</h5>
                                <p>{feedback.message}</p>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Restart</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(5); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Submit &nbsp; {loading && <div style={{ color: "black" }} uk-spinner="ratio: .5"></div>}</button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div >
        );
    }


    if (id === "ideas") {
        const UnpromptedSteps = [
            { label: 'Reciever' },
            { label: 'Idea' },
            { label: 'Effect' },
            { label: 'Company Values' },
            { label: 'Confirmation' }
        ];

        const effect = [
            { name: "Productivity", icon: "" },
            { name: "Morale", icon: "" },
            { name: "Health and Safety", icon: "" },
            { name: "Customer Service", icon: "" },
            // { name: "Revenue", icon: "" },
            { name: "Quality", icon: "" },
            { name: "other", icon: "" },
        ]

        const values = [
            { name: "Transparency", icon: "" },
            { name: "Professionalism", icon: "" },
            { name: "Integrity", icon: "" },
            { name: "Innovation", icon: "" },
            { name: "Sustainability", icon: "" }
        ]

        const handleEffect = (effect: string) => {
            setcheckEffect(effect);
            if (effect !== "other") setActiveIndex(3);
            setFeedback({ ...feedback, effect });
        }
        const handleCompanyValue = (companyValue: string) => {
            setActiveIndex(4);
            setFeedback({ ...feedback, companyValue });
        }

        const handleSubmit = async () => {
            setLoading(true);
            await api.feedback.create({ ...feedback, date: new Date().toString(), sender: `${currentUser?.uid}`, category: id });
            sendMail("Idea");
            setLoading(false);
            navigate("/c/feedback/give");
        }

        return (
            <div className="feedback-actions">
                <FeedbackBreadCrumb values={items} />
                <br />
                <div className="inner-actions">
                    <Steps model={UnpromptedSteps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <div className="options">
                        {
                            activeIndex === 0 &&
                            <div >
                                <h4 style={{ textAlign: "center" }}>Where should we send your idea?</h4>
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
                        }

                        {
                            activeIndex === 1 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>Lets hear your idea!</h4>
                                    <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, message: e.target.value }); }} placeholder="Message" aria-label="Textarea"></textarea>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 2 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>What do you think this idea would improve?</h4>
                                <div className="option-items">
                                    {
                                        effect.map((effect, key) => (
                                            <div className="o-item" key={key + effect.name} onClick={() => { handleEffect(effect.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={effect.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{effect.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                {
                                    checkEffect === "other" && <div className="uk-margin feedback-below">
                                        <input className="uk-input" defaultValue={feedback.effect} onChange={(e: any) => { setFeedback({ ...feedback, effect: e.target.value }); }} type="text" placeholder="What do you think this idea would improve?" aria-label="Input"></input>
                                    </div>
                                }

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(1); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 3 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>Does this idea demonstrate certain company values?</h4>
                                <div className="option-items">
                                    {
                                        values.map((value, key) => (
                                            <div className="o-item" key={key + value.name} onClick={() => { handleCompanyValue(value.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={value.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{value.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(4); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 4 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>{currentUser?.displayName}, just to confirm</h4>

                                <h5>Lets hear your idea.</h5>
                                <p>{feedback.message}</p>

                                <h5>What do you think this idea would improve?</h5>
                                <p>{feedback.effect}</p>

                                <h5>Does this idea demonstrate certain company values?</h5>
                                <p>{feedback.companyValue}</p>

                                <h5>Where should we send your idea?</h5>
                                <p>{store.user.getItemById(feedback.recipient)?.asJson.displayName}</p>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Restart</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Submit &nbsp; {loading && <div style={{ color: "black" }} uk-spinner="ratio: .5"></div>}</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }


    if (id === "praise") {
        const UnpromptedSteps = [
            { label: 'Reciever' },
            { label: 'Praise' },
            { label: 'Company Value' },
            { label: 'Confirmation' }
        ];

        const values = [
            { name: "Transparency", icon: "" },
            { name: "Professionalism", icon: "" },
            { name: "Integrity", icon: "" },
            { name: "Innovation", icon: "" },
            { name: "Sustainability", icon: "" }
        ]

        const handleCompanyValue = (companyValue: string) => {
            setActiveIndex(3);
            setFeedback({ ...feedback, companyValue });
        }

        const handleSubmit = async () => {
            setLoading(true);
            await api.feedback.create({ ...feedback, date: new Date().toString(), sender: `${currentUser?.uid}`, category: id });
            sendMail("Praise");
            setLoading(false);
            navigate("/c/feedback/give");
        }

        return (
            <div className="feedback-actions">
                <FeedbackBreadCrumb values={items} />
                <br />
                <div className="inner-actions">
                    <Steps model={UnpromptedSteps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <div className="options">
                        {
                            activeIndex === 0 &&
                            <div >
                                <h4 style={{ textAlign: "center" }}>Who has done great things?</h4>
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
                        }

                        {
                            activeIndex === 1 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>What has {store.user.getItemById(feedback.recipient)?.asJson.displayName} done that deserves praise?</h4>
                                    <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, message: e.target.value }); }} placeholder="Eg. Great job on your recent project" aria-label="Textarea"></textarea>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 2 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>Which company values has {store.user.getItemById(feedback.recipient)?.asJson.displayName} demonstrated?</h4>
                                <div className="option-items">
                                    {
                                        values.map((value, key) => (
                                            <div className="o-item" key={key + value.name} onClick={() => { handleCompanyValue(value.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={value.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{value.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(1); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 3 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>{currentUser?.displayName}, just to confirm</h4>

                                <h5>What have they done that deserves praise?</h5>
                                <p>{feedback.message}</p>

                                <h5>Which company values did they demonstrate? </h5>
                                <p>{feedback.companyValue}</p>

                                <h5>Your Praise will be sent to</h5>
                                <p>{store.user.getItemById(feedback.recipient)?.asJson.displayName}</p>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Restart</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Submit &nbsp; {loading && <div style={{ color: "black" }} uk-spinner="ratio: .5"></div>}</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }


    if (id === "peers-feedback") {
        const UnpromptedSteps = [
            { label: 'Reciever' },
            { label: 'Observation' },
            { label: 'Reason' },
            { label: 'Suggestion' },
            { label: 'Feel' },
            { label: 'Confirmation' }
        ];

        const values = [
            { name: "Helpful", icon: "" },
            { name: "Encouraging", icon: "" },
            { name: "Useful", icon: "" }
        ]

        const handleFeel = (feel: string) => {
            setActiveIndex(5);
            setFeedback({ ...feedback, feel });
        }

        const handleSubmit = async () => {
            setLoading(true);
            await api.feedback.create({ ...feedback, date: new Date().toString(), sender: `${currentUser?.uid}`, category: id });
            sendMail("Peers feedback");
            setLoading(false);
            navigate("/c/feedback/give");
        }

        return (
            <div className="feedback-actions">
                <FeedbackBreadCrumb values={items} />
                <br />
                <div className="inner-actions">
                    <Steps model={UnpromptedSteps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <div className="options">
                        {
                            activeIndex === 0 &&
                            <div >
                                <h4 style={{ textAlign: "center" }}>Hi {store.user.getItemById(feedback.recipient)?.asJson.displayName}, who are you giving feedback to?</h4>
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
                        }

                        {
                            activeIndex === 1 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>Recently, I have observed that</h4>
                                    <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, observation: e.target.value }); }} placeholder="Eg. They seem disengaged" aria-label="Textarea"></textarea>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 2 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>I mention this because</h4>
                                    <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, reason: e.target.value }); }} placeholder="Eg. I think they could do better" aria-label="Textarea"></textarea>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(1); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 3 &&
                            <div>
                                <div className="feedback-below">
                                    <h4 style={{ textAlign: "center" }}>One suggestion I have</h4>
                                    <div className="uk-margin" style={{ display: "flex", alignItems: "flex-end" }}>
                                        <textarea className="uk-textarea" defaultValue={feedback.message} rows={6} onChange={(e: any) => { setFeedback({ ...feedback, suggestion: e.target.value }); }} placeholder="Eg. Pay more attention" aria-label="Textarea"></textarea>
                                    </div>
                                    <div className="actions-button">
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(2); }}>Prev</button>
                                        <button className="btn btn-primary" onClick={(e) => { setActiveIndex(4); }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            activeIndex === 4 &&
                            <div>
                                <h4 style={{ textAlign: "center" }}>I hope you find this feedback</h4>
                                <div className="option-items">
                                    {
                                        values.map((value, key) => (
                                            <div className="o-item" key={key + value.name} onClick={() => { handleFeel(value.name) }}>
                                                <div className="f-card-media-top">
                                                    {/* <img src={value.icon} width="80" height="80" alt="icon" /> */}
                                                </div>
                                                <span className="f-card-title">{value.name}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(3); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(5); }}>Next</button>
                                </div>
                            </div>
                        }
                        {
                            activeIndex === 5 &&
                            <div className="feedback-below">
                                <h4 style={{ textAlign: "center" }}>{currentUser?.displayName}, just to confirm</h4>

                                <h5>Recently, I've observed that</h5>
                                <p>{feedback.observation}</p>

                                <h5>I mention this because </h5>
                                <p>{feedback.reason}</p>

                                <h5>One suggestion I have</h5>
                                <p>{feedback.suggestion}</p>

                                <h5>I hope you find this feedback</h5>
                                <p>{feedback.feel}</p>

                                <h5>Your Feedback will be sent to</h5>
                                <p>{store.user.getItemById(feedback.recipient)?.asJson.displayName}</p>

                                <div className="actions-button">
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(0); }}>Restart</button>
                                    <button className="btn btn-primary" onClick={(e) => { setActiveIndex(4); }}>Prev</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Submit &nbsp; {loading && <div style={{ color: "black" }} uk-spinner="ratio: .5"></div>}</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }


    return (
        <ErrorBoundary>
            <div className="feedback-home">
                selected option not available please try again!!
            </div>
        </ErrorBoundary>
    )
})

export default GiveFeedbackActions;


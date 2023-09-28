import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Idea from "../../assets/images/feedback/ideas.svg";
import Praise from "../../assets/images/feedback/praise.svg";
import GivePeers from "../../assets/images/feedback/respond.svg";
import Unprompted from "../../assets/images/feedback/unprompted2.svg";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import FeedbackBreadCrumb from "./tabs/feedbackBreadCrumb";

const GiveFeedback: FC = observer(() => {
    const { store, api } = useAppContext();
    const [loading, setLoading] = useState(false);
    useTitle("Give Feedback");
    useBackButton("/c/feedback/home");
    const navigate = useNavigate();

    const items = [
        { label: "Feedback", link: "/c/feedback/home" },
        { label: "Give Feedback", link: "/c/feedback/give" }
    ]

    const catergories = [
        { id: "unprompted", name: "Unprompted", icon: Unprompted, description: "Just something I would like to point out" },
        { id: "ideas", name: "Share Ideas", icon: Idea, description: "I have an idea" },
        { id: "praise", name: "Praise", icon: Praise, description: "Praise my colleagues publicly" },
        { id: "peers-feedback", name: "Give Feedback to my peers", icon: GivePeers, description: "Share feedback with a colleague" },
    ];

    return (
        <ErrorBoundary>
            <div style={{ padding: "2rem" }}>
                <FeedbackBreadCrumb values={items} />
            </div>
            <div className="feedback-home">
                {catergories.map((item, key) => (
                    <div key={item.id + key} className="feedback-item" onClick={(e) => navigate(`/c/feedback/give/${item.id}`)}>
                        <div className="f-logo">
                            <img className="uk-animation-stroke" src={item.icon}
                                // uk-svg="stroke-animation: true"
                                alt={`${item.name}, ${item.id}`} />
                        </div>
                        <div className="f-content">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    )
})

export default GiveFeedback;

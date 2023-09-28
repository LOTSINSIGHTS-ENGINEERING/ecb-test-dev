import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import requestFeedback from "../../assets/images/feedback/requestFeedback.svg";
import postFeedback from "../../assets/images/feedback/postFeedback.svg";
import historyFeedback from "../../assets/images/feedback/historyFeedback.svg";
import { useNavigate } from "react-router-dom";

const FeedbackHome: FC = observer(() => {
    const { store, api } = useAppContext();
    const currentUser = store.auth.meJson;
    useTitle("Feedback");
    useBackButton();
    const navigate = useNavigate();

    useEffect(() => {
        api.user.getAll();
    }, [api.user]);

    return (
        <ErrorBoundary>
            <div className="feedback-info">
                <h3>Hi {currentUser?.displayName}, what brings you here?</h3>
            </div>
            <div className="feedback-home">
                <div className="feedback-item" onClick={() => navigate("/c/feedback/give")}>
                    <div className="f-logo">
                        <img className="uk-animation-stroke" src={postFeedback}
                            // uk-svg="stroke-animation: true"
                            alt="request feedback" />
                    </div>
                    <div className="f-content">
                        <h4>Give Feedback</h4>
                        <p>I want to share my thoughts</p>
                    </div>
                </div>

                <div className="feedback-item" onClick={() => navigate("/c/feedback/request")}>
                    <div className="f-logo">
                        <img className="uk-animation-stroke" src={requestFeedback}
                            // uk-svg="stroke-animation: true"
                            alt="request feedback" />
                    </div>
                    <div className="f-content">
                        <h4>Request Feedback</h4>
                        <p>I want to get input from my peers</p>
                    </div>
                </div>

                <div className="feedback-item" onClick={() => navigate("/c/feedback/history")}>
                    <div className="f-logo">
                        <img className="uk-animation-stroke" src={historyFeedback}
                            // uk-svg="stroke-animation: true"
                            alt="request feedback" />
                    </div>
                    <div className="f-content">
                        <h4>Feedback History</h4>
                        <p>View Sent or Received Feedback</p>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
})

export default FeedbackHome

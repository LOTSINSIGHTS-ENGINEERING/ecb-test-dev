import FeedbackHistory from "../feedback/FeedbackHistory.page";
import FeedbackHome from "../feedback/FeedbackHome.page";
import GiveFeedback from "../feedback/GiveFeedback.page";
import GiveFeedbackActions from "../feedback/GiveFeedbackActions.page";
import RequestFeedback from "../feedback/RequestFeedback.page";

type Routes = {
    path: string;
    component: React.FC;
    title?: string;
}

const FeedbackRoutes: Routes[] = [
    { path: "feedback/home", component: FeedbackHome, title: "Feedback" },
    { path: "feedback/history", component: FeedbackHistory, title: "Feedback History" },
    { path: "feedback/give", component: GiveFeedback, title: "Give Feedback" },
    { path: "feedback/give/:id", component: GiveFeedbackActions, title: "Give Unprompted Feedback" },
    { path: "feedback/request", component: RequestFeedback, title: "Request Feedback " },
];

export default FeedbackRoutes
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import FeedbackHistoryList from "./components/FeebackHistoryList";
import FeedbackModal from "./dialogs/give-feedback/GiveFeedbackModal";
import FeedbackBreadCrumb from "./tabs/feedbackBreadCrumb";
import FeedbackTabs from "./tabs/FeedbackTabs";

const FeedbackHistory: FC = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);
  useTitle("Feedback History");
  useBackButton("/c/feedback/home");

  const items = [
    { label: "Feedback", link: "/c/feedback/home" },
    { label: "Feedback History", link: "/c/feedback/history" }
  ]

  const selectedValue = localStorage.getItem("feedback-selected-tab");
  const [selectedTab, setselectedTab] = useState(selectedValue ?? "peers-feedback-tab");
  const feedbackHistoryList = store.feedback.all.map(value => value?.asJson);

  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.feedback.getAll();
      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.feedback, api.user]);



  return (
    <ErrorBoundary>
      <div className="admin-settings uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            {!loading && (
              <div className="uk-margin">
                <div>
                  <FeedbackBreadCrumb values={items} />
                </div>
                <h2 className="feedback-title">Employee Feedback</h2>
                <FeedbackTabs selectedTab={selectedTab} setselectedTab={setselectedTab} />

                {selectedTab === "unprompted-tab" && <FeedbackHistoryList catergory="unprompted" feedbackHistoryList={feedbackHistoryList.filter(feedback => feedback.category === "unprompted")} />}
                {selectedTab === "ideas-tab" && <FeedbackHistoryList catergory="ideas" feedbackHistoryList={feedbackHistoryList.filter(feedback => feedback.category === "ideas")} />}
                {selectedTab === "praise-tab" && <FeedbackHistoryList catergory="praise" feedbackHistoryList={feedbackHistoryList.filter(feedback => feedback.category === "praise")} />}
                {selectedTab === "peers-feedback-tab" && <FeedbackHistoryList catergory="peers-feedback" feedbackHistoryList={feedbackHistoryList.filter(feedback => feedback.category === "peers-feedback")} />}
                {selectedTab === "request-tab" && <FeedbackHistoryList catergory="request" feedbackHistoryList={feedbackHistoryList.filter(feedback => feedback.type === "request")} />}
              </div>
            )}
          </ErrorBoundary>

          <ErrorBoundary>
            {store.feedback.isEmpty && (
              <EmptyError errorMessage="No feedbacks found" />
            )}
          </ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.FEEDBACK.CREATE}>
          <FeedbackModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  )
})

export default FeedbackHistory

// import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
// import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
// import { useAppContext } from "../../../shared/functions/Context";
// import { hideModalFromId } from "../../../shared/functions/ModalShow";
// import {
//   defaultScorecardMetadata,
//   IScorecardMetadata,
// } from "../../../shared/models/ScorecardMetadata";
// import MODAL_NAMES from "../ModalName";
// import "./ViewPerformanceReviewModal.scss";

// const ViewPerformanceReviewModal = observer(() => {
//   const { api, store, ui } = useAppContext();

//   const [performanceReview, setPeformanceReview] = useState<IScorecardMetadata>(
//     { ...defaultScorecardMetadata }
//   );
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       await api.individualScorecard.update(performanceReview);
//       setLoading(false);
//       // show success
//       ui.snackbar.load({
//         id: Date.now(),
//         message: "Performance review updated",
//         type: "success",
//       });
//     } catch (error) {
//       // show error
//       ui.snackbar.load({
//         id: Date.now(),
//         message: "Error updating performance review",
//         type: "danger",
//       });
//     }

//     onCancel();
//   };

//   const onCancel = () => {
//     hideModalFromId(MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL);
//   };

//   useEffect(() => {
//     const updateForm = () => {
//       const agreement = store.individualScorecard.selected;
//       if (!agreement) return;

//       setPeformanceReview({
//         ...defaultScorecardMetadata,
//         ...agreement,
//       });
//     };

//     updateForm();
//   }, [store.individualScorecard.selected]);

//   return (
//     <ErrorBoundary>
//       <div className="uk-modal-dialog view-performance-review-modal">
//         <button
//           className="uk-modal-close-full"
//           type="button"
//           data-uk-close
//         ></button>

//         <div className="uk-modal-header">
//           <h3 className="uk-modal-title">Midterm Review Feedback</h3>
//         </div>

//         <div className="uk-modal-body" data-uk-overflow-auto>
//           <form className="uk-form-stacked">
//             <div className="uk-margin">
//               <label className="uk-form-label" htmlFor="form-stacked-text">
//                 Discuss areas of excellence in performance
//               </label>
//               <div className="uk-form-controls">
//                 <textarea
//                   className="uk-textarea uk-form-small"
//                   rows={3}
//                   placeholder="Write a discussion of the excellence in performance."
//                 ></textarea>
//               </div>
//             </div>

//             <div className="uk-margin">
//               <label className="uk-form-label" htmlFor="form-stacked-text">
//                 Discuss suggested areas of improvement
//               </label>
//               <div className="uk-form-controls">
//                 <textarea
//                   className="uk-textarea uk-form-small"
//                   rows={3}
//                   placeholder="Write a discussion suggested areas of improvement."
//                 ></textarea>
//               </div>
//             </div>

//             <div className="uk-margin">
//               <label className="uk-form-label" htmlFor="form-stacked-text">
//                 Discuss future goals with set expectations
//               </label>
//               <div className="uk-form-controls">
//                 <textarea
//                   className="uk-textarea uk-form-small"
//                   rows={3}
//                   placeholder="Write a discussion of the excellence in performance."
//                 ></textarea>
//               </div>
//             </div>

//             <div className="uk-margin">
//               <label className="uk-form-label" htmlFor="form-stacked-text">
//                 Comments (Additional)
//               </label>
//               <div className="uk-form-controls">
//                 <textarea
//                   className="uk-textarea uk-form-small"
//                   rows={3}
//                   placeholder="Write a comments."
//                 ></textarea>
//               </div>
//             </div>
//           </form>

//           {/* <div>Reviewed By: </div>
//           <div>Reviewer Position: </div> */}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// });

// export default ViewPerformanceReviewModal;

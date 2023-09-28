import { useEffect, useRef, useState } from "react";
// import { useAppContext } from "../functions/Context";
// import { IReviewCycleType } from "../models/ScorecardBatch";
// import { IScorecardReview } from "../models/ScorecardReview";

// const useDepartmentReview = (
//   cycle: IReviewCycleType,
//   departmentId?: string
// ): IScorecardReview | undefined => {
//   const { api, store } = useAppContext();
//   const draftApi = api.departmentScorecardReview.draft;
//   const midtermApi = api.departmentScorecardReview.quarter2;
//   const asssessmentApi = api.departmentScorecardReview.quarter4;

//   const [review, setReview] = useState<IScorecardReview>();
//   const firstRender = useRef(true);

//   useEffect(() => {
//     if (!firstRender.current || !departmentId) return;
//     firstRender.current = false;

//     // load data scorecard from db
//     const loadAll = async (departmentId: string) => {
//       try {
//         await draftApi.getByUid(departmentId); // Load Draft
//         await midtermApi.getByUid(departmentId); // Load midterm
//         await asssessmentApi.getByUid(departmentId); // Load Assessment
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     loadAll(departmentId);
//   }, [asssessmentApi, draftApi, midtermApi, departmentId]);

//   // Get the review
//   useEffect(() => {
//     if (!departmentId) return;

//     let _review;

//     switch (cycle) {
//       case "Scorecard":
//         _review =
//           store.departmentScorecardReview.draft.getItemById(departmentId);
//         break;
//       case "Midterm Reviews":
//         _review =
//           store.departmentScorecardReview.quarter2.getItemById(departmentId);
//         break;
//       case "Assessment":
//         _review =
//           store.departmentScorecardReview.quarter4.getItemById(departmentId);
//         break;
//       default:
//         _review = undefined;
//         break;
//     }

//     if (_review) {
//       setReview(_review.asJson);
//     } else {
//       setReview(undefined); // no data yet
//     }
//   }, [
//     cycle,
//     store.departmentScorecardReview.draft,
//     store.departmentScorecardReview.quarter2,
//     store.departmentScorecardReview.quarter4,
//     departmentId,
//   ]);

//   return review;
// };

// export default useDepartmentReview;

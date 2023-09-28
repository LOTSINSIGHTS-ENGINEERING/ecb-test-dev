import { observer } from "mobx-react-lite";
// import { useState, useEffect } from "react";
// import { LoadingEllipsis } from "../../shared/components/loading/Loading";
// import { useAppContext } from "../../shared/functions/Context";
// import useTitle from "../../shared/hooks/useTitle";
// import EmptyError from "../admin-settings/EmptyError";
// import FYPlan from "./FYPlan";
// import useBackButton from "../../shared/hooks/useBack";
// import "./DepartmentScorecards.scss";
// import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
// import Department from "../../shared/models/Department";

// const DepartmentScorecards = observer(() => {
//   const { api, store } = useAppContext();

//   const [loading, setLoading] = useState(false);
//   useTitle("Departmental Scorecards");
//   useBackButton();

//   const sort = (a: Department, b: Department) => {
//     return a.asJson.name.localeCompare(b.asJson.name);
//   };

//   useEffect(() => {
//     // load data from db
//     const loadAll = async () => {
//       setLoading(true); // start loading
//       try {
//         await api.scorecard.getAll();
//         await api.department.getAll();
//       } catch (error) {
//         console.log(error);
//       }
//       setLoading(false); // stop loading
//     };

//     loadAll();
//   }, [api.department, api.scorecard]);

//   return (
//     <ErrorBoundary>
//       <div className="departmental-scorecard-plan-page uk-section uk-section-small">
//         <div className="uk-container uk-container-xlarge">
//           {!loading &&
//             store.scorecard.all.map((batch) => (
//               <div key={batch.asJson.id} className="uk-margin">
//                 <FYPlan
//                   scorecardBatch={batch.asJson}
//                   departments={store.department.all.sort(sort)}
//                 />
//               </div>
//             ))}

//           {/* Empty & not loading */}
//           {!store.scorecard.all.length && !loading && (
//             <EmptyError errorMessage="No scorecards found" />
//           )}

//           {/* Loading */}
//           {loading && <LoadingEllipsis />}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// });

// export default DepartmentScorecards;

import { useState, useEffect } from "react";
// import { observer } from "mobx-react-lite";
// import { LoadingEllipsis } from "../../shared/components/loading/Loading";
// import { useAppContext } from "../../shared/functions/Context";
// import useTitle from "../../shared/hooks/useTitle";
// import EmptyError from "../admin-settings/EmptyError";
// import useBackButton from "../../shared/hooks/useBack";
// import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
// import { useNavigate } from "react-router-dom";
// import { USER_ROLES } from "../../shared/functions/CONSTANTS";
// import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
// import Division from "../../shared/models/Division";
// import "./DivisionScorecards.scss";
// import { identity } from "lodash";

// interface IDivisionScorecardProps {
//   scorecardId: string;
//   division: Division;
// }
// const DivisionScorecard = (props: IDivisionScorecardProps) => {
//   const { scorecardId, division } = props;
//   const { id, name, departmentName } = division.asJson;
//   const navigate = useNavigate();
//   const { store } = useAppContext();

//   const divisionId = store.auth.division;
//   const role = store.auth.role;

//   const canView = role === USER_ROLES.HR_USER || id === divisionId;

//   const onUpdate = () => {
//     navigate(`${scorecardId}/${id}`);
//   };

//   return (
//     <ErrorBoundary>
//       <div className="division-scorecard uk-card uk-card-default uk-card-body uk-card-small">
//         <div className="uk-grid-small uk-grid-match" data-uk-grid>
//           <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
//             <h6 className="name">
//               <span className="span-label">Name</span>
//               {name} Scorecard
//             </h6>
//           </div>

//           <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
//             <h6>
//               <span className="span-label">Department</span>
//               {departmentName}
//             </h6>
//           </div>

//           <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
//             <div className="controls">
//               <button
//                 className="btn btn-primary"
//                 onClick={onUpdate}
//                 disabled={!canView}
//               >
//                 View <span uk-icon="arrow-right"></span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// interface IFYPlanProps {
//   scorecardBatch: IScorecardBatch;
//   divisions: Division[];
// }
// const FYPlan = observer((props: IFYPlanProps) => {
//   const { store } = useAppContext();

//   const { scorecardBatch, divisions } = props;
//   const { description, locked } = scorecardBatch;

//   const department = store.auth.department;
//   const role = store.auth.role;

//   const fyPlanCssClass = locked
//     ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small"
//     : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";

//   const filterAccess = () => {
//     if (role !== USER_ROLES.EMPLOYEE_USER || role !== USER_ROLES.GUEST_USER)
//       return divisions;
//     else if (
//       role === USER_ROLES.EMPLOYEE_USER ||
//       role === USER_ROLES.GUEST_USER
//     )
//       return divisions.filter((division) => division.asJson.id === department);
//     else return [];
//   };

//   return (
//     <ErrorBoundary>
//       <div className={fyPlanCssClass}>
//         <h6 className="title">
//           Financial Year: {description}
//           {locked && (
//             <>
//               <span className="lock-icon" data-uk-icon="icon: lock"></span>
//               <span className="locked-text">Locked</span>
//             </>
//           )}
//         </h6>
//       </div>

//       {filterAccess().map((division) => (
//         <DivisionScorecard
//           key={division.asJson.id}
//           scorecardId={scorecardBatch.id}
//           division={division}
//         />
//       ))}
//     </ErrorBoundary>
//   );
// });

// const DivisionScorecards = observer(() => {
//   const { api, store } = useAppContext();

//   const [loading, setLoading] = useState(false);
//   useTitle("Division Scorecards");
//   useBackButton();

//   const sort = (a: Division, b: Division) => {
//     return a.asJson.name.localeCompare(b.asJson.name);
//   };

//   useEffect(() => {
//     // load data from db
//     const loadAll = async () => {
//       setLoading(true); // start loading
//       try {
//         await api.scorecard.getAll();
//         await api.division.getAll();
//       } catch (error) {
//         console.log(error);
//       }
//       setLoading(false); // stop loading
//     };

//     loadAll();
//   }, [api.division, api.scorecard]);

//   return (
//     <ErrorBoundary>
//       <div className="division-scorecard-plan-page uk-section uk-section-small">
//         <div className="uk-container uk-container-xlarge">
//           {!loading &&
//             store.scorecard.all.map((batch) => (
//               <div key={batch.asJson.id} className="uk-margin">
//                 <FYPlan
//                   scorecardBatch={batch.asJson}
//                   divisions={store.division.all.sort(sort)}
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

// export default DivisionScorecards;

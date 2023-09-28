import { observer } from "mobx-react-lite";
// import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
// import { USER_ROLES } from "../../shared/functions/CONSTANTS";
// import { useAppContext } from "../../shared/functions/Context";
// import Department from "../../shared/models/Department";
// import { IScorecardBatch } from "../../shared/models/ScorecardBatch";
// import DepartmentScorecard from "./DepartmentScorecard";

// interface IProps {
//   scorecardBatch: IScorecardBatch;
//   departments: Department[];
// }
// const FYPlan = observer((props: IProps) => {
//   const { store } = useAppContext();

//   const { scorecardBatch, departments } = props;
//   const { description, locked } = scorecardBatch;

//   // role + department id
//   const department = store.auth.department;
//   const role = store.auth.role;

//   const fyPlanCssClass = locked
//     ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small"
//     : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";

//   const filterAccess = () => {
//     // return departments.filter((dep) => dep.asJson.id === department);

//     if (role !== USER_ROLES.EMPLOYEE_USER || role !== USER_ROLES.GUEST_USER)
//       return departments;
//     else if (
//       role === USER_ROLES.EMPLOYEE_USER ||
//       role === USER_ROLES.GUEST_USER
//     )
//       return departments.filter((dep) => dep.asJson.id === department);
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

//       {filterAccess().map((department) => (
//         <div key={department.asJson.id}>
//           <DepartmentScorecard
//             scorecardId={scorecardBatch.id}
//             departmentId={department.asJson.id}
//             name={department.asJson.name}
//           />
//         </div>
//       ))}
//     </ErrorBoundary>
//   );
// });

// export default FYPlan;

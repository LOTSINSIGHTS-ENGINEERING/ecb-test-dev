import { useNavigate } from "react-router-dom";
// import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
// import { USER_ROLES } from "../../shared/functions/CONSTANTS";
// import { useAppContext } from "../../shared/functions/Context";

// interface IProps {
//   scorecardId: string;
//   departmentId: string;
//   name: string;
// }
// const DepartmentScorecard = (props: IProps) => {
//   const { scorecardId, departmentId, name } = props;
//   const { store } = useAppContext();
//   const department = store.auth.department;
//   const role = store.auth.role;

//   const canView = role === USER_ROLES.SUPER_USER || role === USER_ROLES.HR_USER || departmentId === department;
//   // const canView = departmentId !== department;

//   const navigate = useNavigate();

//   const onUpdate = () => {
//     navigate(`${scorecardId}/${departmentId}`);
//   };

//   return (
//     <ErrorBoundary>
//       <div className="department-scorecard uk-card uk-card-default uk-card-body uk-card-small">
//         <h6 className="name">
//           <span className="span-label">Name</span>
//           {name} Scorecard
//         </h6>
//         <div className="controls">
//           <button
//             className="btn btn-primary"
//             onClick={onUpdate}
//             disabled={!canView}
//           >
//             View <span uk-icon="arrow-right"></span>
//           </button>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default DepartmentScorecard;

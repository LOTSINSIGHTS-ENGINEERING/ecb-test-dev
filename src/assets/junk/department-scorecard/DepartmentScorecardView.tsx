import { useEffect, useState } from "react";
// import useTitle from "../../../shared/hooks/useTitle";
// import { observer } from "mobx-react-lite";
// import { useAppContext } from "../../../shared/functions/Context";
// import { useNavigate, useParams } from "react-router-dom";
// import useBackButton from "../../../shared/hooks/useBack";
// import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
// import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
// import DepartmentScorecardObjectives from "./DepartmentScorecardObjectives";

// const DepartmentScorecardView = observer(() => {
//   const { fyid, departmentId } = useParams();
//   const { store, api } = useAppContext();
//   const [loading, setLoading] = useState(false);
//   const scorecard = store.scorecard.getItemById(`${fyid}`); // scorecard.

//   const [_, setTitle] = useTitle(); // set page title
//   const navigate = useNavigate();
//   useBackButton("/c/strategy/department/");

//   useEffect(() => {
//     const setPageTitle = () => {
//       const department = store.department.getItemById(`${departmentId}`);
//       const scorecardName = scorecard ? scorecard.asJson.description : "";
//       const departmentName = department ? department.asJson.name : "";

//       if (scorecard) setTitle(`${departmentName} ${scorecardName} Scorecard`);
//       else navigate("/c/strategy/department/");
//     };

//     setPageTitle();
//   }, [departmentId, navigate, scorecard, setTitle, store.department]);

//   useEffect(() => {
//     const loadAll = async () => {
//       if (!departmentId) return;
//       setLoading(true);
//       try {
//         await api.user.getByDepartment(departmentId);
//         await api.department.getAll();
//         await api.objective.getAllObjectives();
//         await api.measure.getAllMeasures();
//       } catch (error) {
//         alert("Cannot read data");
//       }
//       setLoading(false);
//     };
//     loadAll();
//   }, [api.department, api.user, api.objective, api.measure]);

//   if (!departmentId) return <></>;

//   return (
//     <ErrorBoundary>
//       <ErrorBoundary>
//         {!loading && (
//           <DepartmentScorecardObjectives departmentId={departmentId} />
//         )}
//       </ErrorBoundary>
//       <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
//     </ErrorBoundary>
//   );
// });

// export default DepartmentScorecardView;

import { useEffect, useState } from "react";
// import useTitle from "../../shared/hooks/useTitle";
// import { observer } from "mobx-react-lite";
// import { useAppContext } from "../../shared/functions/Context";
// import { useNavigate, useParams } from "react-router-dom";
// import useBackButton from "../../shared/hooks/useBack";
// import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
// import DivisionScorecardObjective from "./DivisionScorecardObjective";
// import { LoadingEllipsis } from "../../shared/components/loading/Loading";

// const DivisionScorecardView = observer(() => {
//   const { fyid, divisionId } = useParams();
//   const { store, api } = useAppContext();
//   const [loading, setLoading] = useState(false);
//   const scorecard = store.scorecard.getItemById(`${fyid}`); // scorecard.

//   const [_, setTitle] = useTitle(); // set page title
//   const navigate = useNavigate();
//   useBackButton("/c/strategy/sections/");

//   useEffect(() => {
//     const setPageTitle = () => {
//       const division = store.division.getItemById(`${divisionId}`);
//       const scorecardName = scorecard ? scorecard.asJson.description : "";
//       const divisionName = division ? division.asJson.name : "";

//       if (scorecard) setTitle(`${divisionName} ${scorecardName} Scorecard`);
//       else navigate("/c/strategy/sections/");
//     };

//     setPageTitle();
//   }, [divisionId, navigate, scorecard, setTitle, store.division]);

//   // if (!scorecard) return <></>;

//   useEffect(() => {
//     const loadAll = async () => {
//       if (!divisionId) return;
//       setLoading(true);
//       try {
//         await api.user.getByDivision(divisionId);
//         await api.division.getAll();
//         await api.objective.getAllObjectives();
//         await api.measure.getAllMeasures();
//       } catch (error) {}
//       setLoading(false);
//     };

//     loadAll();
//   }, [api.user, api.division, api.objective, api.measure]);

//   if (!divisionId) return <></>;

//   return (
//     <ErrorBoundary>
//       <ErrorBoundary>
//         {!loading && <DivisionScorecardObjective divisionId={divisionId} />}
//       </ErrorBoundary>
//       <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
//     </ErrorBoundary>
//   );
// });

// export default DivisionScorecardView;

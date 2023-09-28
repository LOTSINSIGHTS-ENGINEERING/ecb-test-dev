import { useState, useEffect } from "react";
// import { observer } from "mobx-react-lite";
// import { useMemo, useState } from "react";
// import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
// import { useAppContext } from "../../../shared/functions/Context";
// import {
//   ALL_TAB,
//   CUSTOMER_TAB,
//   FINANCIAL_TAB,
//   fullPerspectiveName,
//   GROWTH_TAB,
//   PROCESS_TAB,
// } from "../../../shared/interfaces/IPerspectiveTabs";
// import Tabs from "../../../logged-in/shared/components/tabs/Tabs";
// import Toolbar from "../../../logged-in/shared/components/toolbar/Toolbar";
// import { dataFormat } from "../../../shared/functions/Directives";
// import Objective, { IObjective } from "../../../shared/models/Objective";
// import NoMeasures from "../../../logged-in/execution-scorecard/NoMeasures";
// import React from "react";
// import { IMeasure } from "../../../shared/models/Measure";
// import "./DepartmentScorecardView.scss";
// import { rateColor } from "../../../logged-in/shared/functions/Scorecard";
// import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

// interface IMeasureTableItemProps {
//   measure: IMeasure;
// }
// const MeasureTableItem = (props: IMeasureTableItemProps) => {
//   const { measure } = props;

//   const dataType = measure.dataType;
//   const dataSymbol = measure.dataSymbol || "";

//   const rateCss = rateColor(Number(measure.finalRating2 || measure.autoRating2), measure.isUpdated);

//   return (
//     <tr className="row">
//       <td>{measure.description}</td>
//       <td className="no-whitespace">
//         {dataFormat(dataType, measure.rating1, dataSymbol)}
//       </td>
//       <td className="no-whitespace">
//         {dataFormat(dataType, measure.rating2, dataSymbol)}
//       </td>
//       <td className="no-whitespace">
//         {dataFormat(dataType, measure.rating3, dataSymbol)}
//       </td>
//       <td className="no-whitespace">
//         {dataFormat(dataType, measure.rating4, dataSymbol)}
//       </td>
//       <td className="no-whitespace">
//         {dataFormat(dataType, measure.rating5, dataSymbol)}
//       </td>
//       <td className={`no-whitespace actual-value ${rateCss}`}>
//         {measure.autoRating2 || measure.autoRating}
//       </td>
//       <td className={`no-whitespace actual-value ${rateCss}`}>
//         {measure.supervisorRating2 || measure.supervisorRating}
//       </td>
//       <td className={`no-whitespace actual-value ${rateCss}`}>
//         {measure.finalRating2 || measure.finalRating}
//       </td>
//     </tr>
//   );
// };

// interface IMeasureTableProps {
//   measures: IMeasure[];
// }
// const MeasureTable = (props: IMeasureTableProps) => {
//   const { measures } = props;

//   return (
//     <div className="measure-table">
//       {measures.length !== 0 && (
//         <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
//           <thead className="header">
//             <tr>
//               <th className="uk-width-expand@s">Measure/KPI</th>
//               <th>Rating 1</th>
//               <th>Rating 2</th>
//               <th>Rating 3</th>
//               <th>Rating 4</th>
//               <th>Rating 5</th>
//               <th>E-Rating</th>
//               <th>S-Rating</th>
//               <th>F-Rating</th>
//             </tr>
//           </thead>
//           <tbody>
//             {measures.map((measure) => (
//               <ErrorBoundary key={measure.id}>
//                 <MeasureTableItem measure={measure} />
//               </ErrorBoundary>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {measures.length === 0 && <NoMeasures />}
//     </div>
//   );
// };

// interface IObjectiveItemProps {
//   objective: IObjective;
//   children?: React.ReactNode;
// }
// const ObjectiveItem = observer((props: IObjectiveItemProps) => {
//   const { objective, children } = props;

//   return (
//     <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
//       <div className="uk-flex uk-flex-middle">
//         <h3 className="objective-name uk-width-1-1">
//           {objective.description}
//           <div className="uk-margin-small-top"></div>
//           <span className="objective-persepctive">
//             {fullPerspectiveName(objective.perspective)}
//           </span>
//           <span className="objective-weight">
//             Weight: {objective.weight || 0}%
//           </span>
//           <span className="objective-weight">Owner: {objective.userName}</span>
//           {objective.objectiveType === "self-development" && (
//             <span className="objective-type">PDP</span>
//           )}
//         </h3>
//       </div>
//       <div className="uk-margin">{children}</div>
//     </div>
//   );
// });
// interface IStrategicListProps {
//   tab: string;
//   objectives: IObjective[];
// }
// const StrategicList = observer((props: IStrategicListProps) => {
//   const { tab, objectives } = props;
//   const { store } = useAppContext();

//   const getMeasures = (objective: IObjective): IMeasure[] => {
//     return store.measure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
//   };

//   const perspectiveObjectiveGroup = (name: string, filter: string) => {
//     const perpectiveObjectives = objectives.filter((o) => o.perspective === filter);

//     return (
//       <div className="objective-group">
//         <div className="perspective-weight">
//           <span className="name">{name}</span>
//           <span className="arrow"></span>
//         </div>
//         {perpectiveObjectives.map((objective) => (
//           <ErrorBoundary key={objective.id}>
//             <ObjectiveItem objective={objective}>
//               <MeasureTable measures={getMeasures(objective)} />
//             </ObjectiveItem>
//           </ErrorBoundary>
//         ))}
//       </div>
//     );
//   };

//   if (tab === FINANCIAL_TAB.id)
//     return perspectiveObjectiveGroup(FINANCIAL_TAB.name, FINANCIAL_TAB.id);
//   if (tab === CUSTOMER_TAB.id)
//     return perspectiveObjectiveGroup(CUSTOMER_TAB.name, CUSTOMER_TAB.id);
//   if (tab === PROCESS_TAB.id)
//     return perspectiveObjectiveGroup(PROCESS_TAB.name, PROCESS_TAB.id);
//   if (tab === GROWTH_TAB.id)
//     return perspectiveObjectiveGroup(GROWTH_TAB.name, GROWTH_TAB.id);

//   return (
//     <>
//       <ErrorBoundary>
//         {perspectiveObjectiveGroup(FINANCIAL_TAB.name, FINANCIAL_TAB.id)}
//       </ErrorBoundary>
//       <ErrorBoundary>
//         {perspectiveObjectiveGroup(CUSTOMER_TAB.name, CUSTOMER_TAB.id)}
//       </ErrorBoundary>
//       <ErrorBoundary>
//         {perspectiveObjectiveGroup(PROCESS_TAB.name, PROCESS_TAB.id)}
//       </ErrorBoundary>
//       <ErrorBoundary>
//         {perspectiveObjectiveGroup(GROWTH_TAB.name, GROWTH_TAB.id)}
//       </ErrorBoundary>
//     </>
//   );
// });

// interface IProps {
//   departmentId: string;
// }
// const DepartmentScorecardObjectives = observer((props: IProps) => {
//   const { departmentId } = props;
//   const { store } = useAppContext();
//   const [tab, setTab] = useState(ALL_TAB.id);
//   const [loading, setLoading] = useState(false);

//   const groupedByDepartment = () => {
//     const usersId = store.user.all.filter((u) => u.asJson.department === departmentId && !u.asJson.devUser).map((u) => u.asJson.uid);
//     return usersId;
//   };

//   const getObjectives = () => {
//     let objectives: Objective[] = [];
//     groupedByDepartment().map((uId) => {
//       for (const object of store.objective.all) {
//         if (object.asJson.uid === uId) {
//           objectives.push(object);
//         }
//       }
//     });
//     return objectives;
//   };

//   const sortByPerspective = (a: IObjective, b: IObjective) => {
//     const order = ["F", "C", "P", "G"];
//     const aIndex = order.indexOf(a.perspective.charAt(0));
//     const bIndex = order.indexOf(b.perspective.charAt(0));
//     return aIndex - bIndex;
//   };

//   const objectives = useMemo(() => {
//     const sorted = getObjectives().map((o) => o.asJson).sort(sortByPerspective);
//     const _objectives = tab === ALL_TAB.id ? sorted : sorted.filter((o) => o.perspective === tab);
//     return _objectives;
//   }, [getObjectives(), tab]);

//   return (
//     <ErrorBoundary>
//       <div className="departmental-users-scorecard-view-page uk-section uk-section-small">
//         <div className="uk-container uk-container-xlarge">
//           <ErrorBoundary>
//             <Toolbar
//               leftControls={
//                 <ErrorBoundary>
//                   <Tabs tab={tab} setTab={setTab} noMap={true} />
//                 </ErrorBoundary>
//               }
//               rightControls={<ErrorBoundary></ErrorBoundary>}
//             />
//           </ErrorBoundary>
//           <ErrorBoundary>
//             <StrategicList tab={tab} objectives={objectives} />
//           </ErrorBoundary>
//           {loading && <LoadingEllipsis />}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// });

// export default DepartmentScorecardObjectives;

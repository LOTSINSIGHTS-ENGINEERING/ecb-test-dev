import { useEffect, useRef, useState } from "react";
// import { useAppContext } from "../../../shared/functions/Context";
// import {
//   defaultScorecardMetadata,
//   IScorecardMetadata,
// } from "../../../shared/models/ScorecardMetadata";

// const useDivisionScorecardMetadata = (
//   scorecardId: string
// ): IScorecardMetadata => {
//   const { store, api } = useAppContext();
//   const [agreement, setAgreement] = useState<IScorecardMetadata>({
//     ...defaultScorecardMetadata,
//   });
//   const firstRender = useRef(true);

//   useEffect(() => {
//     if (!firstRender.current) return;
//     firstRender.current = false;

//     const load = async () => {
//       try {
//         await api.divisionScorecardMetadata.getByUid(scorecardId);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     load();
//   }, [api.divisionScorecardMetadata, scorecardId]);

//   useEffect(() => {
//     const $agreement = store.divisionScorecardMetadata.getItemById(scorecardId); //   get uid user, or me
//     if (!$agreement) return;

//     setAgreement({
//       ...defaultScorecardMetadata,
//       ...$agreement.asJson,
//     });
//   }, [
//     scorecardId,
//     store.divisionScorecardMetadata,
//     store.divisionScorecardMetadata.all,
//   ]);

//   const returnType: IScorecardMetadata = agreement;
//   return returnType;
// };

// export default useDivisionScorecardMetadata;

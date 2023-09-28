import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import {
  defaultScorecardMetadata,
  IScorecardMetadata,
} from "../models/ScorecardMetadata";

// interface IReturnType {
//   agreement: IScorecardMetadata;
//   loading: boolean;
// }
const useIndividualScorecard = (uid?: string): IScorecardMetadata => {
  const { store, api } = useAppContext();
  const [agreement, setAgreement] = useState<IScorecardMetadata>({
    ...defaultScorecardMetadata,
  });
  const firstRender = useRef(true);
  const me = store.auth.meJson;

  useEffect(() => {
    if (!firstRender.current || !me) return;
    firstRender.current = false;

    const load = async () => {
      if (!me) return;
      const $uid = uid ? uid : me.uid;

      try {
        await api.individualScorecard.getByUid($uid);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [api.individualScorecard, me, uid]);

  useEffect(() => {
    if (!me) return;
    const $uid = uid ? uid : me.uid;
    const $agreement = store.individualScorecard.getItemById($uid); //   get uid user, or me
    if (!$agreement) return;

    setAgreement({
      ...defaultScorecardMetadata,
      ...$agreement.asJson,
      uid: $uid,
    });
  }, [me, store.individualScorecard, store.individualScorecard.all, uid]);

  const returnType: IScorecardMetadata = agreement;
  return returnType;
};

export default useIndividualScorecard;

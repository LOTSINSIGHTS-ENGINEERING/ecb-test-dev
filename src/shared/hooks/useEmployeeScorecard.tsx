import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import {
  defaultScorecardMetadata,
  IScorecardMetadata,
} from "../models/ScorecardMetadata";

interface IReturnType {
  agreement: IScorecardMetadata;
  loading: boolean;
}

const useEmployeeScorecard = (uid?: string): IReturnType => {
  const { store, api } = useAppContext();
  const [agreement, setAgreement] = useState<IScorecardMetadata>({
    ...defaultScorecardMetadata,
  });
  const [loading, setLoading] = useState(true);
  const firstRender = useRef(true);

  const metadataNotFound = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!firstRender.current || !uid) return;
    firstRender.current = false;

    const load = async () => {
      setLoading(true);
      try {
        await api.individualScorecard.getByUid(uid, metadataNotFound);
      } catch (error) {}
    };

    load();
  }, [uid, api.individualScorecard, api.department, store.department]);

  useEffect(() => {
    if (!uid) return;
    const $agreement = store.individualScorecard.getItemById(uid);
    if (!$agreement) return;

    setAgreement({
      ...defaultScorecardMetadata,
      ...$agreement.asJson,
      uid: uid,
    });
  }, [store.individualScorecard, store.individualScorecard.all, uid]);

  const returnType = {
    agreement,
    loading,
  };
  return returnType;
};

export default useEmployeeScorecard;

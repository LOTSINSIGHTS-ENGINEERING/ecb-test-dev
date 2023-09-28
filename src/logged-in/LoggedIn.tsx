import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../shared/functions/Context";
import MainLayout from "./main-layout/MainLayout";
import Drawer from "./nagivation/Drawer";

const LoggedIn = observer(() => {
  const { api, store, ui } = useAppContext();
  const [fetchingData, setFetchingData] = useState(true);
  const firstUpdate = useRef(true);

  const loadAll = useCallback(async () => {
    const me = store.auth.meJson;
    if (!me) return; // TODO: handle error.
    const uid = me.uid;
    try {
      await api.objective.getAll(uid); // load objectives
      await api.measure.getAll(uid); // load measures

      // await api.objective.getAll(); // load objectives
      // await api.measure.getAll(); // load measures
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "Failed to load.",
        timeoutInMs: 10000,
      });
    }
  }, [api.measure, api.objective, store.auth.meJson, ui.snackbar]);

  const loadActive = useCallback(async () => {
    setFetchingData(true);
    try {
      await api.scorecard.getActive(); // load active scorecard
      await api.scorecard.getCurrent(); // load current scorecard
      await loadAll(); // load all
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "Failed to load.",
        timeoutInMs: 10000,
      });
    }
    setFetchingData(false);
  }, [api.scorecard, loadAll, ui.snackbar]);

  useEffect(() => {
    loadActive(); // load active scorecard
  }, [loadActive]);

  useEffect(() => {
    if (!store.scorecard.active) return;
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    loadAll(); // load all
  }, [loadAll, store.scorecard, store.scorecard.active]);

  return (
    <div className="responsive-drawer">
      <Drawer />
      <MainLayout fetchingData={fetchingData} />
    </div>
  );
});

export default LoggedIn;

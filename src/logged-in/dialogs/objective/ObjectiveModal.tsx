import { faArrowUpRightDots, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { CUSTOMER_TAB, FINANCIAL_TAB, GROWTH_TAB, PROCESS_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { defaultObjective, IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../ModalName";
import PerformanceObjectiveForm from "./PerformanceObjectiveForm";
import SelfDevelopObjectiveForm from "./SelfDevelopObjectiveForm";

enum TAB_TYPE {
  PERFORMANCE_OBJECTIVE,
  SELF_DEVELOPMENT_OBJECTIVE,
}
interface ITabsProps {
  tab: TAB_TYPE;
  setTab: Dispatch<SetStateAction<TAB_TYPE>>;
  objective: IObjective;
  setObjective: React.Dispatch<React.SetStateAction<IObjective>>;
}
const Tabs = (props: ITabsProps) => {
  const { tab, setTab, objective, setObjective } = props;

  const className = (_tabName: TAB_TYPE) =>
    _tabName === tab ? "objective-tab active" : "objective-tab";

  const onPerformance = () => {
    setObjective({ ...objective, objectiveType: "performance" });
  };

  const onSelfDevelopment = () => {
    setObjective({ ...objective, objectiveType: "self-development" });
  };

  useEffect(() => {
    if (objective.objectiveType === "self-development")
      setTab(TAB_TYPE.SELF_DEVELOPMENT_OBJECTIVE);
    else setTab(TAB_TYPE.PERFORMANCE_OBJECTIVE);
  }, [objective.objectiveType, setTab]);

  return (
    <div className="objective-tabs uk-margin">
      <button
        className={className(TAB_TYPE.PERFORMANCE_OBJECTIVE)}
        onClick={onPerformance}
      >
        <FontAwesomeIcon icon={faBullseye} className="icon" />
        <div className="content">
          <p className="label">Performance Objective (KPA)</p>
        </div>
      </button>

      <button
        className={className(TAB_TYPE.SELF_DEVELOPMENT_OBJECTIVE)}
        onClick={onSelfDevelopment}
      >
        <FontAwesomeIcon icon={faArrowUpRightDots} className="icon" />
        <div className="content">
          <p className="label">Self Development Objective (KPA)</p>
        </div>
      </button>
    </div>
  );
};

const ObjectiveModal = observer(() => {
  const { api, store } = useAppContext();
  const [objective, setObjective] = useState(defaultObjective);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TAB_TYPE>(TAB_TYPE.PERFORMANCE_OBJECTIVE);

  const me = store.auth.meJson; //my user account
  const scorecard = store.scorecard.activeId; //active scorecard id

  const getCompanyObjectives = () => {
    if (!me) return []; //TODO: alert invalid uid.

    const companies = store.companyObjective.all.map((o) => o.asJson);
    return companies;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!me) return; //TODO: alert invalid uid.

    setLoading(true); // start loading

    // update objective uid && userName
    const $objective: IObjective = {
      ...objective,
      uid: me.uid,
      userName: me.displayName || "",
      weight: Number(objective.weight) || 0,
    };

    // if selected objective, update
    const selected = store.objective.selected;

    if (selected) await update($objective);
    else await create($objective);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (objective: IObjective) => {
    try {
      await api.objective.update(objective);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (objective: IObjective) => {
    try {
      await api.objective.create(objective);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    setTab(TAB_TYPE.PERFORMANCE_OBJECTIVE);
    setObjective({ ...defaultObjective }); // reset form
    hideModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_MODAL);
  };

  useEffect(() => {
    // load department objectives from db
    const loadAll = async () => {
      if (!me) return; //TODO: alert invalid uid.

      if (!scorecard) return;

      setLoading(true); // start loading
      try {
        await api.companyObjective.getAll(scorecard);
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyObjective,
    me,
    scorecard,
  ]);

  useEffect(() => {
    const updateFormOnMount = () => {
      // if selected objective, set form values
      if (store.objective.selected)
        setObjective({
          ...store.objective.selected,
        });

      // no selected objective
      if (!store.objective.selected) {
        const pespective = store.objective.perspective;

        switch (pespective) {
          case FINANCIAL_TAB.id:
            setObjective({
              ...defaultObjective,
              perspective: FINANCIAL_TAB.id,
            });
            break;
          case CUSTOMER_TAB.id:
            setObjective({ ...defaultObjective, perspective: CUSTOMER_TAB.id });
            break;
          case PROCESS_TAB.id:
            setObjective({ ...defaultObjective, perspective: PROCESS_TAB.id });
            break;
          case GROWTH_TAB.id:
            setObjective({ ...defaultObjective, perspective: GROWTH_TAB.id });
            break;
          default:
            setObjective({
              ...defaultObjective,
              perspective: FINANCIAL_TAB.id,
            });
            break;
        }
      }
    };

    updateFormOnMount();
  }, [store.objective.perspective, store.objective.selected]);

  return (
    <div className="objective-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        title="Close or Cancel"
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Objective (KPA)</h3>

      <div className="dialog-content uk-position-relative">
        <Tabs
          tab={tab}
          setTab={setTab}
          objective={objective}
          setObjective={setObjective}
        />

        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          {tab === TAB_TYPE.PERFORMANCE_OBJECTIVE && (
            <PerformanceObjectiveForm
              companyObjectives={getCompanyObjectives()}
              objective={objective}
              setObjective={setObjective}
            />
          )}

          {tab === TAB_TYPE.SELF_DEVELOPMENT_OBJECTIVE && (
            <SelfDevelopObjectiveForm
              companyObjectives={getCompanyObjectives()}
              objective={objective}
              setObjective={setObjective}
            />
          )}

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ObjectiveModal;

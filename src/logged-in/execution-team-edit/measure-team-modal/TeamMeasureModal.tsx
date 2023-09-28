import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultMeasure, IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../../dialogs/ModalName";
import { measureQ2Rating, measureQ4Rating } from "../../shared/functions/Scorecard";
import MeasureForm, { MeasureCommentsForm } from "./TeamMeasureForm";
import "./MeasureModal.scss";

interface ITabsProps {
  tab: "Metrics" | "Comments";
  setTab: React.Dispatch<React.SetStateAction<"Metrics" | "Comments">>;
}
const Tabs = (props: ITabsProps) => {
  const activeClass = (tab: "Metrics" | "Comments") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="uk-margin-small-bottom">
      <ul className="kit-tabs" data-uk-tab>
        <li
          className={activeClass("Metrics")}
          onClick={() => props.setTab("Metrics")}
        >
          <a href="#">Metrics</a>
        </li>
        <li
          className={activeClass("Comments")}
          onClick={() => props.setTab("Comments")}
        >
          <a href="#">Comments</a>
        </li>
      </ul>
    </div>
  );
};

const TeamMeasureModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const { uid, objectiveId } = useParams();

  const user = store.user.getItemById(uid!);

  const [objective, setObjective] = useState<IObjective | null>(null);

  const [tab, setTab] = useState<"Metrics" | "Comments">("Metrics");
  const [measure, setMeasure] = useState<IMeasure>(defaultMeasure);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !objective) return;

    setLoading(true);

    const $measure: IMeasure = {
      ...measure,
      uid: uid!,
      userName: user?.asJson.displayName || "",
      objective: objective.id,
      perspective: objective.perspective,
      objectiveType: objective.objectiveType || "performance",
      department: user?.asJson.department || "",

      // new added fields, probably not not at the backend already.
      autoRating: 1,
      autoRating2: 1,
      supervisorRating: null,
      supervisorRating2: null,
      finalRating: null,
      finalRating2: null,
      midtermComments: "",
      assessmentComments: "",
    };

    // if selected measure, update
    const selected = store.measure.selected;
    if (selected) await update($measure);
    else await create($measure);
    // console.log($measure);

    setLoading(false); // stop loading
    onCancel();
  };

  const update = async (measure: IMeasure) => {
    try {
      await api.measure.update(measure);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update.",
        type: "danger",
      });
    }
  };

  const create = async (measure: IMeasure) => {
    try {
      await api.measure.create(measure);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to create.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    // clear selected measure & selected objective
    store.measure.clearSelected();
    store.objective.clearSelected();
    setMeasure({ ...defaultMeasure }); // reset form
    setTab("Metrics"); // reset tab
    hideModalFromId(MODAL_NAMES.TEAM.TEAM_MEASURE_MODAL);
  };

  useEffect(() => {
    const selectedMeasure = store.measure.selected;
    // no selected measure, and no selected objective
    if (!selectedMeasure && !objective) setMeasure({ ...defaultMeasure });
    // if selected measure, set form values
    else if (selectedMeasure) setMeasure({ ...selectedMeasure });
    // if selected objective, set form values
    else if (objective && !selectedMeasure)
      setMeasure({
        ...defaultMeasure,
        objective: objective.id,
        objectiveType: objective.objectiveType,
      });
  }, [store.measure.selected, objective]);

  useEffect(() => {
    const getObjective = () => {
      const objective = store.objective.all.find((o) => o.asJson.id === objectiveId);

      if (objective) {
        store.objective.select(objective.asJson);
        setObjective(objective.asJson);
      } else {
        setObjective(null);
        hideModalFromId(MODAL_NAMES.EXECUTION.MEASURE_MODAL);
      }
    };

    getObjective();
  }, [store.objective, objectiveId]);


  return (
    <div className="measure-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-3-4">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Measure/KPI</h3>

      <div className="dialog-content uk-position-relative">
        <Tabs tab={tab} setTab={setTab} />

        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          {tab === "Metrics" && (
            <MeasureForm measure={measure} setMeasure={setMeasure} />
          )}

          {tab === "Comments" && (
            <MeasureCommentsForm measure={measure} setMeasure={setMeasure} />
          )}

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
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

export default TeamMeasureModal;

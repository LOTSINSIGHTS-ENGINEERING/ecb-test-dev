import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultRisk, IProjectRisk, IRiskSeverity, IRiskStatus } from "../../../shared/models/ProjectRisks.model";
import MODAL_NAMES from "../ModalName";

interface Iprops {
  projectId: string;
}

const NewRiskModal = observer((props: Iprops) => {

  const { api, store } = useAppContext();
  const projectId = props.projectId;
  const me = store.auth.meJson;

  const objectives = store.companyObjective.all.map(item => item.asJson);
  const scorecard = store.scorecard.active;

  const [risk, setRisk] = useState<IProjectRisk>({ ...defaultRisk });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // start loading
    if (!me) return;
    const $risk: IProjectRisk = {
      ...risk,
      usersId: [me.uid],
      projectId: projectId,
    }
    await create($risk);
    setLoading(false); // stop loading
    onCancel();
  };


  const create = async (risk: IProjectRisk) => {
    try {
      await api.projectManagement.createRisk(projectId, risk);
    } catch (error) { }
  };

  const onCancel = () => {
    setRisk(defaultRisk)
    hideModalFromId(MODAL_NAMES.PROJECTS.CREATE_RISK);
  };

  useEffect(() => {
    const FetchPortfolio = async () => {
      if (store.companyObjective.all.length === 0 && scorecard) {
        if (!scorecard) return;
        await api.companyObjective.getAll(scorecard.id);
      }
    }
    FetchPortfolio().catch()
  }, [api.companyObjective, scorecard, store.companyObjective.all.length])


  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">New Risk</h3>
      <div className="dialog-content uk-position-relative">
        <form onSubmit={handleSubmit}>
          <fieldset className="uk-fieldset">
            <div className="uk-margin">
              <input required className="uk-input" type="text" placeholder="Risk name"
                onChange={(e) => setRisk({ ...risk, riskName: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="severity">Severity/Impact</label>
              <select id="severity" className="uk-select" name="severity"
                onChange={(e) => setRisk({ ...risk, severity: e.target.value as IRiskSeverity })}>
                <option value={"low"}>Low</option>
                <option value={"medium"}>Medium</option>
                <option value={"high"}>High</option>
              </select>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="level">Status</label>
              <select id="level" className="uk-select" name="level"
                onChange={(e) => setRisk({ ...risk, status: e.target.value as IRiskStatus })}>
                <option value={"potential"}>Potential</option>
                <option value={"identified"}>Identified</option>
                <option value={"resolved"}>Resolved</option>
              </select>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="logdate">Risk Log Date</label>
              <input id="logdate" required className="uk-input" type="date" placeholder="Risk Log Date"
                onChange={(e) => setRisk({ ...risk, logDate: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="resDate">Resolution Date</label>
              <input id="resDate" className="uk-input" type="date" placeholder="Risk Resolution Date"
                onChange={(e) => setRisk({ ...risk, resolutionDate: e.target.value })} />
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="objectives">Which company objectives is this risk linked to?</label>
              <select id="objectives" className="uk-select" name="objectives"
                onChange={(e) => setRisk({ ...risk, objectives: e.target.value })}>
                {
                  objectives.map((objective, key) => (
                    <option key={`${key}-${objective.description}`} value={objective.description}>{objective.description}</option>
                  ))
                }
              </select>
            </div>
            <div className="uk-margin">
              <textarea className="uk-textarea" rows={2} placeholder="Description" required
                onChange={(e) => setRisk({ ...risk, description: e.target.value })}></textarea>
            </div>
          </fieldset>
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
              disabled={loading || !objectives.length}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default NewRiskModal;



// description: "",
// severity: "low",
// logDate: "",
// resolutionDate: "",
// level: "risk",
// objectives: ""
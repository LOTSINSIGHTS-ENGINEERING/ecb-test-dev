import { useAppContext } from "../../shared/functions/Context";
import { IScorecardArchive } from "../../shared/models/ScorecardArchive";
import { generateIndividualPerformanceAgreementPDF } from "../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { useState } from "react";

interface IProps {
  archive: IScorecardArchive;
}
const ArchiveItem = (props: IProps) => {
  const { archive } = props;
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false)
  const scorecardId = store.scorecard.activeId

  const handleExportPDF = async () => {
    if (scorecardId) {
      setLoading(true)
      try {

        await api.companyObjective.getAll(scorecardId);
        const title = `${archive.displayName} Scorecard`;
        const strategicObjectives = [...store.companyObjective.all.map((o) => o.asJson),] || [];
        const objectives = archive.objectives;
        const measures = archive.measures;
        generateIndividualPerformanceAgreementPDF(title, strategicObjectives, objectives, measures);

      } catch (error) {
        setLoading(false)
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to export.",
          type: "danger",
        });
      }
    }
    setLoading(false)
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete?")) return;
    await api.scorecardaArchive.delete(archive);
  };

  return (
    <div className="department uk-card uk-card-default uk-card-body uk-card-small">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">User Name</span>
            {archive.displayName}
          </h6>
        </div>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-auto@m uk-text-center">
          <div className="controls">
            <button
              className="btn btn-primary uk-margin-small-right"
              onClick={handleExportPDF}
              title="Export PDF."
              type="button"
              disabled={loading}
            >
              Export PDF
              {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              title="Export PDF."
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveItem;

import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { useAppContext } from "../../../shared/functions/Context";
import MODAL_NAMES from "../../dialogs/ModalName";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import StrategicMapObjectiveModal from "../../dialogs/strategic-map-objective/StrategicMapObjectiveModal";
import { toPng } from "html-to-image";
import { vision, mission } from "../../../shared/components/vision-mission/VisionMission";
import { generateCompanyDashboardPDF } from "../../../shared/functions/scorecard-pdf/GeneratePerformaneAgreementPDF";
import { IndividualDashboardQ2 } from "./IndividualDashboardQ2";
import { IndividualDashboardQ4 } from "./IndividualDashboardQ4";

interface ITabsProps {
  tab: "Q2" | "Q4";
  setTab: React.Dispatch<React.SetStateAction<"Q2" | "Q4">>;
  handleExportPDF: () => Promise<void>;
  loading: boolean;
}
const Tabs = observer((props: ITabsProps) => {
  const activeClass = (tab: "Q2" | "Q4") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="dashboard--company--tab">
      <div>
        <button className="tab-button uk-button uk-button-default" type="button"
          onClick={props.handleExportPDF}
          disabled={props.loading}>
          Export PDF
          {props.loading && <div data-uk-spinner="ratio: .5"></div>}
        </button>
      </div>
      <div>
        <button className="tab-button uk-button uk-button-default" type="button">Select Semester</button>
        <div data-uk-dropdown>
          <ul className="kit-tabs uk-nav uk-dropdown-nav">
            <li className={activeClass("Q2")}
              onClick={() => props.setTab("Q2")}><a href="#">Semester 1</a></li>
            <li className={activeClass("Q4")}
              onClick={() => props.setTab("Q4")}><a href="#">Semester 2</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export const IndividualDashboard = observer(() => {
  const { ui } = useAppContext();
  const [loading, setLoading] = useState(false)

  const chartref = useRef<HTMLDivElement>(null)

  const handleExportPDF = async () => {
    if (chartref.current === null) {
      return
    }
    try {
      setLoading(true)
      await toPng(chartref.current, { cacheBust: true, }).then(async (dataUrl) => {
        const link = document.createElement('a')
        link.href = dataUrl
        await generateCompanyDashboardPDF(
          vision,
          mission,
          link
        );
      })
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to export.",
        type: "danger",
      });
    }
    setLoading(false)
  };

  const [tab, setTab] = useState<"Q2" | "Q4">("Q2");

  return (
    <ErrorBoundary>
      <Tabs tab={tab} setTab={setTab} handleExportPDF={handleExportPDF} loading={loading} />
      <div className="individual-dashboard">
        {tab === "Q2" &&
          <div ref={chartref}>
            <IndividualDashboardQ2 />
          </div>
        }
        {tab === "Q4" &&
          <div ref={chartref}>
            <IndividualDashboardQ4 />
          </div>
        }
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL} cssClass="uk-modal-container" >
          <StrategicMapObjectiveModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>

  );
});

export default IndividualDashboard
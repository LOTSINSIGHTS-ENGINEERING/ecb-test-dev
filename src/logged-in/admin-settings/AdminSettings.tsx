import { useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import SettingsTabs from "./SettingsTabs";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import DepartmentList from "./DepartmentList";
import UserList from "./UserList";
import ScorecardList from "./ScorecardList";
import BusinessUnitList from "./BusinessUnitList";
import UserModal from "../dialogs/user/UserModal";
import Modal from "../../shared/components/Modal";
import BusinessUnitModal from "../dialogs/business-unit/BusinessUnitModal";
import DepartmentModal from "../dialogs/department/DepartmentModal";
import ScorecardBatchModal from "../dialogs/scorecard-batch/ScorecardBatchModal";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import DivisionModal from "../dialogs/division/DivisionModal";
import DivisionList from "./DivisionList";
import StrategicThemeModal from "../dialogs/strategic-theme/StrategicThemeModal";
import StrategicThemeList from "./StrategicThemeList";
import ArchiveList from "./ArchiveList";

const AdminSettings = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("user-tab");
  const [loading, setLoading] = useState(false);
  const scorecardId = store.scorecard.activeId;
  // const notActive - store
  useTitle("Admin Settings");
  useBackButton();

  const handleNewBatch = () => {
    store.scorecard.clearSelected(); // clear selected scorecard batch
    showModalFromId(MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL); // show modal
  };

  const handleNewDepartment = () => {
    store.department.clearSelected(); // clear selected department
    showModalFromId(MODAL_NAMES.ADMIN.DEPARTMENT_MODAL); // show modal
  };

  const handleNewDivision = () => {
    store.division.clearSelected(); // clear selected division
    showModalFromId(MODAL_NAMES.ADMIN.DIVISION_MODAL); // show modal
  };

  const handleNewBusinessUnit = () => {
    store.businessUnit.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL); // show modal
  };

  const handleNewStrategicTheme = () => {
    store.strategicTheme.clearSelected(); // clear selected business unit
    showModalFromId(MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL); // show modal
  };

  useEffect(() => {
    // load data from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.division.getAll();
        await api.department.getAll();
        await api.scorecard.getAll();
        await api.businessUnit.getAll();
        await api.strategicTheme.getAll(scorecardId!);
        await api.scorecardaArchive.getAll();
      } catch (error) {
        // console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
    // console.log("ScorecardId: ", scorecardId);
  }, [api.businessUnit, api.department, api.division, api.scorecardaArchive, api.scorecard, api.strategicTheme, api.user, scorecardId]);

  return (
    <ErrorBoundary>
      <div className="admin-settings uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                leftControls={
                  <SettingsTabs
                    selectedTab={selectedTab}
                    setselectedTab={setselectedTab}
                  />
                }
                rightControls={
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      Add
                    </button>
                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewBatch}
                        >
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Scorecard
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewDivision}
                        >
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Section
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewDepartment}
                        >
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Department
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewBusinessUnit}
                        >
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Business Unit
                        </button>
                      </li>
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleNewStrategicTheme}
                        >
                          <span data-uk-icon="icon: plus; ratio:.8"></span>
                          New Strategic Goals
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            {!loading && (
              <div className="uk-margin">
                {selectedTab === "user-tab" && <UserList />}
                {selectedTab === "scorecard-tab" && <ScorecardList />}
                {selectedTab === "division-tab" && <DivisionList />}
                {selectedTab === "department-tab" && <DepartmentList />}
                {selectedTab === "business-unit-tab" && <BusinessUnitList />}
                {selectedTab === "strategic-theme-tab" && (<StrategicThemeList />)}
                {selectedTab === "archive-tab" && <ArchiveList />}
              </div>
            )}
          </ErrorBoundary>

          {/* Loading */}
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <UserModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.SCORECARD_BATCH_MODAL}>
          <ScorecardBatchModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.DIVISION_MODAL}>
          <DivisionModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.DEPARTMENT_MODAL}>
          <DepartmentModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.BUSINESS_UNIT_MODAL}>
          <BusinessUnitModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.STRATEGIC_THEME_MODAL}>
          <StrategicThemeModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default AdminSettings;

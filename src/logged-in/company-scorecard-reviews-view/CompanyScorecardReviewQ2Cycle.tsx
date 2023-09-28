import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import { MAIL_EMAIL, MAIL_MIDTERM_RATINGS_ME } from "../../shared/functions/mailMessages";
import showModalFromId from "../../shared/functions/ModalShow";
import useAutoSave from "../../shared/hooks/useAutoSave";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany, { IMeasureCompany } from "../../shared/models/MeasureCompany";
import ObjectiveCompany, { IObjectiveCompany } from "../../shared/models/ObjectiveCompany";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import EmptyError from "../admin-settings/EmptyError";
import CompanyScorecardQ2ApprovalModal from "../dialogs/company-scorecard-q2-approval/CompanyScorecardQ2ApprovalModal";
import CompanyScorecardQ2RejectionModal from "../dialogs/company-scorecard-q2-rejection/CompanyScorecardQ2RejectionModal";
import MODAL_NAMES from "../dialogs/ModalName";
import ObjectiveCompanyQ2CommentModal from "../dialogs/objective-company/ObjectiveCompanyQ2CommentModal";
import NumberInput, { NumberInputValue } from "../shared/components/number-input/NumberInput";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor } from "../shared/functions/Scorecard";
import { sortByPerspective } from "../shared/utils/utils";
import NoMeasures from "./NoMeasures";
import NoPerformanceData from "./NoPerformanceData";

interface IMeasureTableItemProps {
  measure: MeasureCompany;
  canUpdate: boolean;
  midtermRated: boolean;
}
const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { api, store, ui } = useAppContext();
  const { canUpdate, midtermRated } = props;
  const measure = props.measure.asJson;

  const { autoSave } = useAutoSave({ timeout: 2000 });
  const [unsavedChanges, setunSavedChanges] = useState(false);
  const [ratingCss, setRatingCss] = useState("");

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const [q2FinalRating] = useState<number | null>(() => measure.q2FinalRating);
  const [q2SupervisorRating] = useState<number | null>(
    () => measure.q2supervisorRating
  );

  const onSuperChange = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;

    try {
      const $measure: IMeasureCompany = {
        ...measure,
        q2supervisorRating: _rating,
        isUpdated: true,
      };
      autoSave(async () => {
        setunSavedChanges(true);
        await api.companyMeasure.update($measure);
        setunSavedChanges(false);
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        type: "success",
        message: `Failed to update ${measure.description}`,
        timeoutInMs: 10000,
      });
    }
  };

  const onFinalChange = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;
    try {
      const $measure: IMeasureCompany = {
        ...measure,
        q2FinalRating: _rating,
        isUpdated: true,
      };
      autoSave(async () => {
        setunSavedChanges(true);
        await api.companyMeasure.update($measure);
        setunSavedChanges(false);
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        type: "success",
        message: `Failed to update ${measure.description}`,
        timeoutInMs: 10000,
      });
    }
  };

  const handleEditComments = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_MIDTERM_MODAL);
  };

  useEffect(() => {
    if (measure.q2FinalRating) {
      const rateCss = rateColor(Number(measure.q2FinalRating), measure.isUpdated);
      setRatingCss(rateCss);
    } else if (measure.q2supervisorRating) {
      const ratingCss = rateColor(Number(measure.q2supervisorRating), measure.isUpdated);
      setRatingCss(ratingCss);
    } else {
      const ratingCss = rateColor(measure.rating, measure.isUpdated);
      setRatingCss(ratingCss);
    }
  }, [measure]);

  return (
    <tr className="row">
      <td>
        <div className={`status ${ratingCss}`}></div>
      </td>
      <td className="uk-width-expand@s kit-sticky-column no-whitespace">
        {measure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
        <button
          title="Comments"
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comments; ratio: 0.7"
        />
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.baseline, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating1, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating2, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating3, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating4, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.rating5, dataSymbol)}
      </td>
      <td className="no-whitespace">
        {dataFormat(dataType, measure.quarter2Actual, dataSymbol)}
      </td>
      <td className={`no-whitespace actual-value ${ratingCss}`}>
        {measure.rating}
      </td>
      {canUpdate ? (
        <>
          <td className={`actual-value ${ratingCss}`}>
            <NumberInput
              id="kpi-final-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={q2SupervisorRating}
              onChange={onSuperChange}
              disabled={midtermRated}
              min={1}
              max={5}
            />
          </td>
          <td className={`actual-value ${ratingCss}`}>
            <NumberInput
              id="kpi-midterm-final-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={q2FinalRating}
              onChange={onFinalChange}
              min={1}
              max={5}
              disabled={!midtermRated}
            />
          </td>
          <td>
            <div className="controls">
              {unsavedChanges && (
                <button title="Save Changes" className="btn-icon">
                  <div data-uk-spinner="ratio: .5"></div>
                </button>
              )}
            </div>
          </td>
        </>
      ) : (
        <>
          <td className={`actual-value ${ratingCss}`}>
            {measure.q2supervisorRating}
          </td>
          <td className={`actual-value ${ratingCss}`}>
            {measure.q2FinalRating}
          </td>
        </>
      )}
    </tr>
  );
});

interface IMeasureTableProps {
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;
  midtermRated: boolean;
}

const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, midtermRated, agreement } = props;

  const canUpdate = useMemo(() => agreement.quarter2Review.status === "submitted",
    [agreement.quarter2Review.status]
  );

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th></th>
              <th className="uk-width-expand@s kit-sticky-column">
                Measure/KPI
              </th>
              <th>Baseline</th>
              <th>Rating 1</th>
              <th>Rating 2</th>
              <th>Rating 3</th>
              <th>Rating 4</th>
              <th>Rating 5</th>
              <th>Progress</th>
              <th>E-Rating</th>
              <th>S-Rating</th>
              <th>F-Rating</th>
              {canUpdate && <th></th>}
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <MeasureTableItem
                key={measure.asJson.id}
                measure={measure}
                canUpdate={canUpdate}
                midtermRated={midtermRated}
              />
            ))}
          </tbody>
        </table>
      )}
      {measures.length === 0 && <NoMeasures />}
    </div>
  );
});

interface IObjectiveItemProps {
  objective: ObjectiveCompany;
  children?: React.ReactNode;
  handleComments: () => void;
}
const ObjectiveItem = observer((props: IObjectiveItemProps) => {
  const { children, objective, handleComments } = props;

  const { description, perspective, weight } = objective.asJson;
  const { rate, isUpdated } = objective.q2Rating;

  return (
    <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
      <div className="uk-flex uk-flex-middle">
        <div className="uk-margin-right">
          <Rating rate={rate} isUpdated={isUpdated} />
        </div>
        <h3 className="objective-name uk-width-1-1">
          <span>{description} </span>
          <div className="uk-margin-small-top" />
          <span className="objective-persepctive">
            {fullPerspectiveName(perspective)}
          </span>
          <span className="objective-weight">Weight: {weight || 0}%</span>
          <button
            style={{ marginLeft: ".5rem" }}
            title="Comments"
            className="comments-btn btn-text uk-margin-small-left"
            onClick={handleComments}
            data-uk-icon="icon: comments; ratio: 0.8"
          ></button>
        </h3>
      </div>

      <div className="uk-margin">{children}</div>
    </div>
  );
});

interface IStrategicListProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
  midtermRated: boolean;
}

const ObjectivesList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { objectives, agreement, midtermRated } = props;

  const handleComments = (objective: IObjectiveCompany) => {
    store.companyObjective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_Q2_COMMENT_MODAL);
  };

  return (
    <div className="objective-table uk-margin">
      {objectives.map((objective) => (
        <ObjectiveItem key={objective.asJson.id} objective={objective}
          handleComments={() => handleComments(objective.asJson)}
        >
          <MeasureTable
            measures={objective.measures}
            agreement={agreement}
            midtermRated={midtermRated}
          />
        </ObjectiveItem>
      ))}

      {!objectives.length && <EmptyError errorMessage="No objective found" />}
    </div>
  );
});

interface IProps {
  agreement: IScorecardMetadata;
  objectives: ObjectiveCompany[];
  hasAccess: boolean;
  handleExportPDF: () => Promise<void>;
  handleExportExcel: () => Promise<void>;
}
const CompanyScorecardQ2Cycle = observer((props: IProps) => {
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
  } = props;

  const { store, api, ui } = useAppContext();

  const [tab, setTab] = useState(ALL_TAB.id);
  const midtermRated = agreement.midtermRated;
  const me = store.auth.meJson;

  const isDisabled = useMemo(
    () => !(agreement.quarter2Review.status === "submitted"),
    [agreement.quarter2Review.status]
  );

  const personInCharge = store.user.getItemById(agreement.uid);
  const personEmail = personInCharge ? personInCharge.asJson.email : "";

  const filteredObjectivesByPerspective = useMemo(() => {
    const sorted = objectives.sort(sortByPerspective);
    return tab === ALL_TAB.id
      ? sorted
      : sorted.filter((o) => o.asJson.perspective === tab);
  }, [objectives, tab]);

  const handleApproval = () => {
    store.companyScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_APPROVAL_MODAL);
  };

  const handleRejection = () => {
    store.companyScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_REJECTION_MODAL);
  };

  const onSubmit = async () => {
    const { MY_SUBJECT, MY_BODY } = MAIL_MIDTERM_RATINGS_ME(
      agreement.displayName,
      me?.displayName
    );

    const $agreement: IScorecardMetadata = { ...agreement, midtermRated: true };

    await api.companyScorecardMetadata.update($agreement);
    await api.mail.sendMailCC(
      [personEmail!],
      [me?.email!],
      MAIL_EMAIL,
      MY_SUBJECT,
      MY_BODY
    );
    ui.snackbar.load({
      id: Date.now(),
      type: "success",
      message: "Email sent.",
      timeoutInMs: 10000,
    });
  };

  if (
    agreement.quarter2Review.status === "pending" ||
    agreement.quarter2Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Midterm performance is not submitted." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="company-plan-view-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} noMap />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary">
                      More <span data-uk-icon="icon: more; ratio:.8"></span>
                    </button>

                    <Dropdown pos="bottom-right">
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={onSubmit}
                          disabled={midtermRated}
                        >
                          <span
                            className="icon"
                            data-uk-icon="icon: play; ratio:.8"
                          ></span>
                          Submit Supervisor Rating
                        </button>
                      </li>
                      {midtermRated ? (
                        <li>
                          <button
                            className="kit-dropdown-btn"
                            onClick={handleApproval}
                            disabled={isDisabled}
                          >
                            <span
                              className="icon"
                              data-uk-icon="icon: check; ratio:.8"
                            ></span>
                            Approve Midterm Reviews
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button
                            className="kit-dropdown-btn"
                            onClick={handleApproval}
                            disabled
                          >
                            <span
                              className="icon"
                              data-uk-icon="icon: check; ratio:.8"
                            ></span>
                            Approve Midterm
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          className="kit-dropdown-btn"
                          onClick={handleRejection}
                          disabled={isDisabled}
                        >
                          <span
                            className="icon"
                            data-uk-icon="icon: close; ratio:.8"
                          ></span>
                          Revert Midterm for Changes
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="uk-margin">
              <ObjectivesList
                agreement={agreement}
                objectives={filteredObjectivesByPerspective}
                midtermRated={midtermRated}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q2_APPROVAL_MODAL}>
          <CompanyScorecardQ2ApprovalModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q2_REJECTION_MODAL}>
          <CompanyScorecardQ2RejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_Q2_COMMENT_MODAL}>
          <ObjectiveCompanyQ2CommentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardQ2Cycle;

import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import { dataFormat } from "../../shared/functions/Directives";
import { MAIL_ASSESSMENT_RATINGS_ME, MAIL_EMAIL } from "../../shared/functions/mailMessages";
import showModalFromId from "../../shared/functions/ModalShow";
import useAutoSave from "../../shared/hooks/useAutoSave";
import { ALL_TAB, fullPerspectiveName } from "../../shared/interfaces/IPerspectiveTabs";
import MeasureCompany, { IMeasureCompany } from "../../shared/models/MeasureCompany";
import ObjectiveCompany, { IObjectiveCompany } from "../../shared/models/ObjectiveCompany";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import EmptyError from "../admin-settings/EmptyError";
import CompanyScorecardQ4ApprovalModal from "../dialogs/company-scorecard-q4-approval/CompanyScorecardQ4ApprovalModal";
import CompanyScorecardQ4RejectionModal from "../dialogs/company-scorecard-q4-rejection/CompanyScorecardQ4RejectionModal";
import MODAL_NAMES from "../dialogs/ModalName";
import ObjectiveCompanyQ4CommentModal from "../dialogs/objective-company/ObjectiveCompanyQ4CommentModal";
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
  assessmentRated: boolean;
}

const MeasureTableItem = observer((props: IMeasureTableItemProps) => {
  const { api, store, ui } = useAppContext();
  const { canUpdate, assessmentRated } = props;

  const measure = props.measure.asJson;
  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const { autoSave } = useAutoSave({ timeout: 2000 });
  const [unsavedChanges, setunSavedChanges] = useState(false);

  const [q4supervisorRating] = useState<number | null>(
    () => measure.q4supervisorRating
  );
  const [q4FinalRating] = useState<number | null>(() => measure.q4FinalRating);
  const [ratingCss, setRatingCss] = useState("");

  const onSuperChange = (value: string | number) => {
    let _rating = NumberInputValue(value);
    if (_rating && _rating > 5) _rating = 5;
    if (_rating && _rating < 1) _rating = 1;

    try {
      const $measure: IMeasureCompany = {
        ...measure,
        q4supervisorRating: _rating,
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
        message: `Failed to update KPI.`,
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
        q4FinalRating: _rating,
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
        message: `Failed to update KPI.`,
        timeoutInMs: 10000,
      });
    }
  };

  const handleEditComments = () => {
    store.companyMeasure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_COMPANY_ASSESSMENT_MODAL);
  };

  useEffect(() => {
    if (measure.q4FinalRating) {
      const rateCss = rateColor(Number(measure.q4FinalRating), measure.isUpdated);
      setRatingCss(rateCss);
    } else if (measure.q4supervisorRating) {
      const ratingCss = rateColor(Number(measure.q4supervisorRating), measure.isUpdated);
      setRatingCss(ratingCss);
    } else {
      const ratingCss = rateColor(measure.q4rating, measure.isUpdated);
      setRatingCss(ratingCss);
    }
  }, [measure]);

  return (
    <tr className="row">
      <td>
        <div className={`status ${ratingCss}`}></div>
      </td>
      <td>{measure.description}
        <span className="measure-sub-weight uk-margin-small-left">
          Sub-Weight: {measure.weight}%
        </span>
        <button
          title="Comments"
          className="comments-btn btn-text uk-margin-small-left"
          onClick={handleEditComments}
          data-uk-icon="icon: comments; ratio: 0.7"
        /></td>
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
        {dataFormat(dataType, measure.annualActual, dataSymbol)}
      </td>
      <td className={`no-whitespace actual-value ${ratingCss}`}>
        {measure.q4rating}
      </td>
      {canUpdate ? (
        <>
          <td className={`actual-value ${ratingCss}`}>
            <NumberInput
              id="kpi-superv-midterm-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={q4supervisorRating}
              onChange={onSuperChange}
              min={1}
              max={5}
              disabled={assessmentRated}
            />
          </td>
          <td className={`actual-value ${ratingCss}`}>
            <NumberInput
              id="kpi-assess-final-rating"
              className="auto-save uk-input uk-form-small"
              placeholder="-"
              value={q4FinalRating}
              onChange={onFinalChange}
              min={1}
              max={5}
              disabled={!assessmentRated}
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
            {measure.q4supervisorRating}
          </td>
          <td className={`actual-value ${ratingCss}`}>
            {measure.q4FinalRating}
          </td>
        </>
      )}
    </tr>
  );
});

interface IMeasureTableProps {
  measures: MeasureCompany[];
  agreement: IScorecardMetadata;
  assessmentRated: boolean;
}
const MeasureTable = observer((props: IMeasureTableProps) => {
  const { measures, agreement, assessmentRated } = props;

  const canUpdate = useMemo(() => agreement.quarter4Review.status === "submitted",
    [agreement.quarter4Review.status]
  );

  return (
    <div className="measure-table">
      {measures.length !== 0 && (
        <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
          <thead className="header">
            <tr>
              <th></th>
              <th className="uk-width-expand@s kit-sticky-column no-whitespace">
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
                assessmentRated={assessmentRated}
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
  const { rate, isUpdated } = objective.q4Rating;

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
  assessmentRated: boolean;
}
const StrategicList = observer((props: IStrategicListProps) => {
  const { store } = useAppContext();
  const { objectives, agreement, assessmentRated } = props;

  const handleComments = (objective: IObjectiveCompany) => {
    store.companyObjective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_Q4_COMMENT_MODAL);
  };

  return (
    <div className="objective-table uk-margin">
      <ErrorBoundary>
        {objectives.map((objective) => (
          <ObjectiveItem key={objective.asJson.id} objective={objective}
            handleComments={() => handleComments(objective.asJson)}
          >
            <MeasureTable
              measures={objective.measures}
              agreement={agreement}
              assessmentRated={assessmentRated}
            />
          </ObjectiveItem>
        ))}
      </ErrorBoundary>
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
const CompanyScorecardReviewQ4Cycle = observer((props: IProps) => {
  const { api, store, ui } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);
  const {
    agreement,
    objectives,
    hasAccess,
    handleExportExcel,
    handleExportPDF,
  } = props;

  const assessmentRated = agreement.assessmentRated;
  const me = store.auth.meJson;

  const isDisabled = useMemo(
    () => !(agreement.quarter4Review.status === "submitted"),
    [agreement.quarter4Review.status]
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
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q4_APPROVAL_MODAL);
  };

  const handleRejection = () => {
    store.companyScorecardMetadata.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q4_REJECTION_MODAL);
  };

  const onSubmit = async () => {
    const { MY_SUBJECT, MY_BODY } = MAIL_ASSESSMENT_RATINGS_ME(
      agreement.displayName,
      me?.displayName
    );

    const $agreement: IScorecardMetadata = {
      ...agreement,
      assessmentRated: true,
    };

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
    agreement.quarter4Review.status === "pending" ||
    agreement.quarter4Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Assessment scorecard not submitted." />
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
                          disabled={assessmentRated}
                        >
                          <span
                            className="icon"
                            data-uk-icon="icon: play; ratio:.8"
                          ></span>
                          Submit Supervisor Rating
                        </button>
                      </li>
                      {assessmentRated ? (
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
                            Approve Final Assessment
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
                            Approve Final Assessment
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
                          Revert Final Assessment for Changes
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <StrategicList
              agreement={agreement}
              objectives={filteredObjectivesByPerspective}
              assessmentRated={assessmentRated}
            />
          </ErrorBoundary>
        </div>
      </div>
      {/* Modals */}
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q4_APPROVAL_MODAL}>
          <CompanyScorecardQ4ApprovalModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.COMPANY_Q4_REJECTION_MODAL}>
          <CompanyScorecardQ4RejectionModal agreement={agreement} />
        </Modal>
      </ErrorBoundary>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_COMPANY_Q4_COMMENT_MODAL}>
          <ObjectiveCompanyQ4CommentModal />
        </Modal>
      </ErrorBoundary>
    </ErrorBoundary>
  );
});

export default CompanyScorecardReviewQ4Cycle;

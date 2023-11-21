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
import Measure, { IMeasure } from "../../shared/models/Measure";
import Objective from "../../shared/models/Objective";
import { IScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import EmptyError from "../admin-settings/EmptyError";
import MODAL_NAMES from "../dialogs/ModalName";
import NumberInput, { NumberInputValue } from "../shared/components/number-input/NumberInput";
import Rating from "../shared/components/rating/Rating";
import Tabs from "../shared/components/tabs/Tabs";
import Toolbar from "../shared/components/toolbar/Toolbar";
import { rateColor, semester1EmpRating, semester1FinalRating, semester1SuperRating } from "../shared/functions/Scorecard";
import NoPerformanceData from "./NoPerformanceData";
import NoMeasures from "./no-measures/NoMeasures";
import { IUser } from "../../shared/models/User";
import PerformanceMidtermApprovalModal from "../dialogs/performance-midterm-approval/PerformanceMidtermApprovalModal";
import PerformanceMidtermRejectionModal from "../dialogs/performance-midterm-rejection/PerformanceMidtermRejectionModal";
import ObjectiveQ2CommentModal from "../dialogs/objective/ObjectiveQ2CommentModal";

interface IMidtermReviewMeasureTableItemProps {
  measure: Measure;
  canUpdate: boolean;
  midtermRated: boolean;
}
const MeasureTableItem = observer((props: IMidtermReviewMeasureTableItemProps) => {
  const { api, store, ui } = useAppContext();
  const { canUpdate, midtermRated } = props;
  const measure = props.measure.asJson;
  const { autoSave } = useAutoSave({ timeout: 2000 });

  const dataType = measure.dataType;
  const dataSymbol = measure.dataSymbol;

  const [finalRating] = useState<number | null>(() => measure.finalRating);
  const [supervisorRating] = useState<number | null>(() => measure.supervisorRating);
  const [unsavedChanges, setunSavedChanges] = useState(false);
  const [ratingCss, setRatingCss] = useState("");

  const readMeasureComment = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_COMMENTS_MIDTERM_MODAL);
  };

  const measureReadOnly = () => {
    store.measure.select(measure); // select measure
    showModalFromId(MODAL_NAMES.EXECUTION.MEASURE_READ_ONLY_MODAL);
  };

  const onSuperChange = (value: string | number) => {
    let rating = NumberInputValue(value);
    if (rating && rating > 5) rating = 5;
    if (rating && rating < 1) rating = 1;

    try {
      autoSave(async () => {
        setunSavedChanges(true);
        await api.measure.update({ ...measure, supervisorRating: rating });
        setunSavedChanges(false);
      });
    } catch (error) {
      setunSavedChanges(false);
    }
  };

  const onFinalChange = (value: string | number) => {
    let rating = NumberInputValue(value);

    if (rating && rating > 5) rating = 5;
    if (rating && rating < 1) rating = 1;
    try {

      autoSave(async () => {
        setunSavedChanges(true);
        await api.measure.update({ ...measure, finalRating: rating });
        setunSavedChanges(false);
      });
    } catch (error) {
      setunSavedChanges(false);
    }
  };

  useEffect(() => {
    if (measure.finalRating) {
      const rateCss = rateColor(Number(measure.finalRating), measure.isUpdated);
      setRatingCss(rateCss);
    } else if (measure.supervisorRating) {
      const ratingCss = rateColor(Number(measure.supervisorRating), measure.isUpdated);
      setRatingCss(ratingCss);
    } else {
      const ratingCss = rateColor(measure.autoRating, measure.isUpdated);
      setRatingCss(ratingCss);
    }
  }, [measure, ratingCss]);

  return (
    <ErrorBoundary>
      <tr className="row" onDoubleClick={measureReadOnly} title="Double click to view more">
        <td>
          <div className={`status ${ratingCss}`}></div>
        </td>
        <td>
          {measure.description}
          <button
            title="Comments"
            className="comments-btn btn-text uk-margin-small-left"
            onClick={readMeasureComment}
            data-uk-icon="icon: comments; ratio: 0.7"
          />
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
          {dataFormat(dataType, measure.annualTarget, dataSymbol)}
        </td>
        <td className="no-whitespace">
          {dataFormat(dataType, measure.annualActual, dataSymbol)}
        </td>
        <td className={`no-whitespace actual-value ${ratingCss}`}>
          {measure.autoRating}
        </td>
        {canUpdate ? (
          <>
            <td className={`actual-value ${ratingCss}`}>
              <NumberInput
                id="kpi-superv-midterm-rating"
                className="auto-save uk-input uk-form-small"
                placeholder="-"
                value={supervisorRating}
                onChange={onSuperChange}
                min={1}
                max={5}
                disabled={midtermRated}
              />
            </td>
            <td className={`actual-value ${ratingCss}`}>
              <NumberInput
                id="kpi-midterm-final-rating"
                className="auto-save uk-input uk-form-small"
                placeholder="-"
                value={finalRating}
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
              {measure.supervisorRating}
            </td>
            <td className={`actual-value ${ratingCss}`}>
              {measure.finalRating}
            </td>
          </>
        )}
      </tr>
    </ErrorBoundary>
  );
});

interface IMidtermReviewProps {
  measures: Measure[];
  canUpdate: boolean;
  midtermRated: boolean;
}
const MeasureTable = observer((props: IMidtermReviewProps) => {
  const { measures, canUpdate, midtermRated } = props;

  return (
    <ErrorBoundary>
      <div className="measure-table">
        {measures.length !== 0 && (
          <table className="measure-table uk-table uk-table-small uk-table-middle uk-table-hover uk-table-divider">
            <thead className="header">
              <tr>
                <th></th>
                <th className="uk-width-expand@s">Measure/KPI</th>
                <th>Rating 1</th>
                <th>Rating 2</th>
                <th>Rating 3</th>
                <th>Rating 4</th>
                <th>Rating 5</th>
                <th>Target</th>
                <th>Progress</th>
                <th>E-Rating</th>
                <th>S-Rating</th>
                <th>F-Rating</th>
                {canUpdate && <th></th>}
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <ErrorBoundary>
                  <MeasureTableItem
                    key={measure.asJson.id}
                    measure={measure}
                    canUpdate={canUpdate}
                    midtermRated={midtermRated}
                  />
                </ErrorBoundary>
              ))}
            </tbody>
          </table>
        )}
        {measures.length === 0 && <NoMeasures />}
      </div>
    </ErrorBoundary>
  );
});

interface ObjectiveItemProps {
  objective: Objective;
  children?: React.ReactNode;
  handleComments: () => void;
}
const ObjectiveItem = observer((props: ObjectiveItemProps) => {
  const { objective, handleComments, children } = props;
  const { weight, description, perspective } = objective.asJson;
  const { rate, isUpdated } = objective.q2Rating;

  return (
    <ErrorBoundary>
      <div className="objective uk-card uk-card-default uk-card-small uk-card-body uk-margin">
        <div className="uk-flex uk-flex-middle">
          <div className="uk-margin-right">
            <Rating rate={rate} isUpdated={isUpdated} />
          </div>
          <h3 className="objective-name uk-width-1-1">
            {description}{" "}
            <span className="objective-persepctive">
              {fullPerspectiveName(perspective)}
            </span>
            <span className="objective-weight">Weight: {weight || 0}%</span>
            <button
              style={{ marginLeft: ".5rem" }}
              title="Comments"
              className="comments-btn btn-text uk-margin-small-left"
              onClick={handleComments}
              data-uk-icon="icon: comment; ratio: 0.9"
            ></button>
          </h3>
        </div>

        <div className="uk-margin">{children}</div>
      </div>
    </ErrorBoundary>
  );
});

interface IRatingProps {
  measures: Measure[];
}
const ScorecardRatings = observer((props: IRatingProps) => {
  const { measures } = props;
  const $measures = measures.map((measure) => measure.asJson);

  const rating1 = semester1EmpRating($measures)
  const rating2 = semester1SuperRating($measures)
  const rating3 = semester1FinalRating($measures)

  const q2_e_css = rateColor(rating1, true);
  const q2_s_css = rateColor(rating2, true);
  const q2_f_css = rateColor(rating3, true);

  return (
    <ErrorBoundary>
      <div className="measure-rating-table">
        <table>
          <thead className="header">
            <tr>
              <th>E-Rating</th>
              <th>S-Rating</th>
              <th>F-Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row">
              <td className={`value ${q2_e_css}`}>
                {rating1.toFixed(2)}
              </td>
              <td className={`value ${q2_s_css}`}>
                {rating2.toFixed(2)}
              </td>
              <td className={`value ${q2_f_css}`}>
                {rating3.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
});

interface IObjectivesProps {
  tab: string;
  objectives: Objective[];
  canUpdate: boolean;
  midtermRated: boolean;
}

const ObjectivesList = observer((props: IObjectivesProps) => {
  const { store } = useAppContext();
  const { tab, objectives, canUpdate, midtermRated } = props;

  const handleComments = (objective: Objective) => {
    store.objective.select(objective.asJson);
    showModalFromId(MODAL_NAMES.EXECUTION.OBJECTIVE_Q2_COMMENT_MODAL);
  };

  const _objectives = useMemo(() => {
    return tab === ALL_TAB.id ? objectives : objectives.filter((o) => o.asJson.perspective === tab);
  }, [store.objective, tab, objectives]);

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        <ErrorBoundary>
          {_objectives.map((objective) => (
            <ObjectiveItem
              handleComments={() => handleComments(objective)}
              key={objective.asJson.id}
              objective={objective}
            >
              <MeasureTable
                measures={objective.measures}
                canUpdate={canUpdate}
                midtermRated={midtermRated}
              />
            </ObjectiveItem>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          {!objectives.length && (<EmptyError errorMessage="No objective found" />)}
        </ErrorBoundary>
      </div>

    </ErrorBoundary>
  );
});

interface IQ2Props {
  agreement: IScorecardMetadata;
  selectedUser: IUser;
  currentUser: IUser;
  measures: Measure[];
  objectives: Objective[];
}

const EmployeeQ2ReviewCycle = observer((props: IQ2Props) => {
  const { store, ui, api } = useAppContext();
  const [tab, setTab] = useState(ALL_TAB.id);

  const { agreement, selectedUser, currentUser, measures, objectives } = props;
  const midtermRated = agreement.midtermRated;

  const isDisabled = useMemo(() => !(agreement.quarter2Review.status === "submitted"), [agreement.quarter2Review.status]);

  const canUpdate = useMemo(() => !(agreement.quarter2Review.status === "submitted"), [agreement]);

  const incompleteReviewError = measures.some((m) => m.asJson.supervisorRating === null);


  const onSubmit = async () => {
    if (incompleteReviewError) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "In complete review. Some measures are not rated.",
        timeoutInMs: 10000,
      });
      return;
    } else if (!selectedUser || !currentUser) {
      ui.snackbar.load({
        id: Date.now(),
        type: "danger",
        message: "User not found, email not sent.",
        timeoutInMs: 10000,
      });
      return;
    }

    const { MY_SUBJECT, MY_BODY } = MAIL_MIDTERM_RATINGS_ME(selectedUser.displayName, currentUser.displayName);

    const $agreement: IScorecardMetadata = { ...agreement, midtermRated: true };
    await api.individualScorecard.update($agreement);
    await api.mail.sendMailCC([selectedUser.email!], [currentUser.email!], MAIL_EMAIL, MY_SUBJECT, MY_BODY);
    ui.snackbar.load({
      id: Date.now(),
      type: "success",
      message: "Email sent.",
      timeoutInMs: 10000,
    });
  };

  const handleApproval = () => {
    store.individualScorecard.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.PERFORMANCE_MIDTERM_APPROVAL_MODAL);
  };

  const handleRejection = () => {
    store.individualScorecard.select(agreement);
    showModalFromId(MODAL_NAMES.EXECUTION.PERFORMANCE_MIDTERM_REJECTION_MODAL);
  };

  // useEffect(() => {
  //   if (store.objective) store.objective.selectPeriod("mid-term");
  // }, [store.objective]);

  if (
    agreement.quarter2Review.status === "pending" ||
    agreement.quarter2Review.status === "in-progress"
  )
    return (
      <ErrorBoundary>
        <NoPerformanceData title="Midterm progress not submitted." />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="scorecard-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              leftControls={<Tabs tab={tab} setTab={setTab} noMap />}
              rightControls={
                <ErrorBoundary>
                  <div className="uk-inline">
                    <button className="btn btn-primary" title="More Options">
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
                            Approve Midterm Reviews
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
                          Revert Midterm Reviews for Changes
                        </button>
                      </li>
                    </Dropdown>
                  </div>
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ObjectivesList tab={tab} objectives={objectives} canUpdate={canUpdate} midtermRated={midtermRated} />
          </ErrorBoundary>
          <ErrorBoundary>
            <ScorecardRatings measures={measures} />
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.PERFORMANCE_MIDTERM_APPROVAL_MODAL}>
              <PerformanceMidtermApprovalModal />
            </Modal>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.PERFORMANCE_MIDTERM_REJECTION_MODAL} >
              <PerformanceMidtermRejectionModal />
            </Modal>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal modalId={MODAL_NAMES.EXECUTION.OBJECTIVE_Q2_COMMENT_MODAL}>
              <ObjectiveQ2CommentModal />
            </Modal>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default EmployeeQ2ReviewCycle;
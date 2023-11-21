import { isEqual } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../shared/components/Modal";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import { defaultBatch, IReviewCycleType, IScorecardBatch } from "../../shared/models/ScorecardBatch";
import MODAL_NAMES from "../dialogs/ModalName";
import PerformanceReviewModal from "../dialogs/performance-review/PerformanceReviewModal";
import ReviewPeople from "./DepartmentReviewPeople";
import ReviewStep from "./DepartmentReviewStep";
import { IScorecardMetadata, defaultScorecardMetadata } from "../../shared/models/ScorecardMetadata";
import User from "../../shared/models/User";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import EmailUsersModal from "../dialogs/email-all-users/EmailUsersModal";

interface ICurrentStageProps {
  openStage: IReviewCycleType;
  batch: IScorecardBatch;
  setBatch: React.Dispatch<React.SetStateAction<IScorecardBatch>>;
  unsavedChanges: boolean;
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  discardChanges: () => void;
  hasAccess: boolean;
}
const CurrentStage = observer((props: ICurrentStageProps) => {
  const [loading, setLoading] = useState(false);

  const { api, store } = useAppContext();
  // my role + my department id
  const role = store.auth.role;
  const department = store.auth.department;
  const division = store.auth.division;
  const meuid = store.auth.meuid;
  // const user = store.user.all;

  const sortByName = (a: User, b: User) => {
    return (a.asJson.displayName || "").localeCompare(
      b.asJson.displayName || ""
    );
  };

  const filterAccess = () => {
    let users: User[] = [];
    if (
      role === USER_ROLES.HR_USER ||
      role === USER_ROLES.EXECUTIVE_USER ||
      role === USER_ROLES.ADMIN_USER
    )
      users = store.user.all.sort(sortByName).filter((u) => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
          return users;
        else return !u.asJson.devUser;
      });
    else if (role === USER_ROLES.GENERAL_MANAGER)
      users = store.user.all.filter((u) => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
          return u.asJson.supervisor === meuid;
        else return u.asJson.supervisor === meuid && !u.asJson.devUser; // production code
      });
    else if (role === USER_ROLES.MANAGER_USER)
      users = store.user.all.filter((u) => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
          return u.asJson.supervisor === meuid;
        else return u.asJson.supervisor === meuid && !u.asJson.devUser; // production code
      });
    return users;
  };

  const scorecards: IScorecardMetadata[] = filterAccess().sort(sortByName).map((user) => {
    const agreement = store.individualScorecard.all.find((agreement) => agreement.asJson.uid === user.asJson.uid);
    const department = store.department.getItemById(user.asJson.department);
    const departmentName = department ? department.asJson.name : "-";
    const divison = store.division.getItemById(user.asJson.division);
    const divisionName = division ? divison?.asJson.name : "-";

    const $agreement = agreement
      ? {
        ...defaultScorecardMetadata,
        ...agreement.asJson,
        department: user.asJson.department,
        departmentName: departmentName,
        division: user.asJson.division,
        divisionName: divisionName,
        uid: user.asJson.uid,
        displayName: user.asJson.displayName || "-",
      }
      : {
        ...defaultScorecardMetadata,
        uid: user.asJson.uid,
        department: user.asJson.department,
        departmentName: departmentName,
        division: user.asJson.division,
        divisionName: divisionName,
        displayName: user.asJson.displayName || "-",
      };
    return $agreement;
  });

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await api.user.getAll();
        await api.department.getAll();
        await api.division.getAll();
        await api.individualScorecard.getAll();
      } catch (error) {
        throw new Error("Failed to load data");
      }
      setLoading(false);
    };

    loadAll();
  }, [api.department, api.division, api.individualScorecard, api.user]);

  if (loading) return <LoadingEllipsis />;

  return (
    <div className="current-stage">
      {/* {props.hasAccess && <StageSettings {...props} />} */}
      <div className="stage-content uk-card uk-card-default uk-card-body uk-card-small uk-margin">
        <ErrorBoundary>
          <ReviewPeople scorecards={scorecards} />
        </ErrorBoundary>
      </div>
    </div>
  );
});

const DepartmentalPerformanceReviews = observer(() => {
  const { store } = useAppContext();
  const [openStage, setOpenStage] = useState<IReviewCycleType>("Scorecard");
  const [batch, setBatch] = useState<IScorecardBatch>({
    ...defaultBatch,
  });

  const role = store.auth.role;
  const hasAccess = useMemo(() => role === USER_ROLES.GENERAL_MANAGER , [role]);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const firstRender = useRef(true);
  useTitle("My Department Performance Reviews"); // set page title

  const discardChanges = () => {
    if (store.scorecard.active)
      setBatch({ ...defaultBatch, ...store.scorecard.active });
  };

  useEffect(() => {
    const active = store.scorecard.active;

    if (firstRender.current) {
      firstRender.current = false;
      if (active) {
        // if first render, open the stage after complete.
        (active.draftReview.status === "approved" ||
          active.draftReview.status === "cancelled") &&
          setOpenStage("Midterm Reviews");
        (active.midtermReview.status === "approved" ||
          active.midtermReview.status === "cancelled") &&
          setOpenStage("Assessment");

        // if first render, open the stage with status in-progress.
        active.draftReview.status === "in-progress" &&
          setOpenStage("Scorecard");
        active.midtermReview.status === "in-progress" &&
          setOpenStage("Midterm Reviews");
        active.finalAssessment.status === "in-progress" &&
          setOpenStage("Assessment");
      }
    }

    if (active) {
      if (isEqual(active, batch)) setUnsavedChanges(false);
      else setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [batch, store.scorecard.active]);

  useEffect(() => {
    if (store.scorecard.active)
      setBatch({ ...defaultBatch, ...store.scorecard.active });
  }, [store.scorecard.active]);

  return (
    <ErrorBoundary>
      <div className="performance-reviews-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            {hasAccess && (
              <ErrorBoundary>
                <ReviewStep
                  openStage={openStage}
                  setOpenStage={setOpenStage}
                  batch={batch}
                />
              </ErrorBoundary>
            )}
          </ErrorBoundary>
          <ErrorBoundary>
            <CurrentStage
              openStage={openStage}
              batch={batch}
              setBatch={setBatch}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              discardChanges={discardChanges}
              hasAccess={hasAccess}
            />
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL}>
        <PerformanceReviewModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.PERFORMANCE_REVIEW.MAIL_ALL_EMPLOYEES_MODAL}>
        <EmailUsersModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default DepartmentalPerformanceReviews;

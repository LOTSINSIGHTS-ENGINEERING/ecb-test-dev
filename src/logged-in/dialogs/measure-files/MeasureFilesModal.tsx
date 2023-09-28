import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { FINANCIAL_TAB, CUSTOMER_TAB, PROCESS_TAB, GROWTH_TAB } from "../../../shared/interfaces/IPerspectiveTabs";
import { IFolderFile } from "../../../shared/models/FolderFile";
import Uploader, { MeasureFiles } from "./MeasureFiles";

const MeasureFilesModal = observer(() => {
  const { store, api, ui } = useAppContext();

  const me = store.auth.meJson;
  const objective = store.objective.selected;
  const measure = store.measure.selected;
  const files = store.folderFile.all.filter(
    (f) => f.asJson.createdBy === me?.uid && f.asJson.measureId === measure?.id
  );

  const measureTitle = measure
    ? measure.description.split(" ").slice(0, 5).join(" ")
    : "Measure files";

  const [loading, setLoading] = useState(false);

  const onSave = async (file: File) => {
    // Essentials of file: (Path -> perspective>FileName), measureId, createdBy, folderId
    const folderId = getFolderId();
    if (!me || !folderId || !measure) {
      ui.snackbar.load({
        id: Date.now(),
        message: `Failed to upload file.`,
        type: "danger",
      });
      return;
    }

    try {
      // UPLOAD FILE
      const folderFile: IFolderFile = {
        id: "",
        url: "",
        name: file.name,
        folderId: folderId, // fix Path-> ScorecardId/DepartmentID/UID/filename.jpg
        measureId: measure.id,
        extension: file.name.split(".").pop() || "",
        createdAt: Date.now(),
        createdBy: me.uid,
      };

      await api.folderFile.create(folderFile, file); // upload the file, folderFileApi
      ui.snackbar.load({
        id: Date.now(),
        message: "Measure has been updated.",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: `Failed to upload file.`,
        type: "danger",
      });
    }
  };

  const getFolderId = () => {
    const fyid = store.scorecard.activeId;
    if (!fyid || !objective) {
      ui.snackbar.load({
        id: Date.now(),
        message: `Failed to upload file.`,
        type: "danger",
      });
      return;
    }
    switch (objective.perspective) {
      case FINANCIAL_TAB.id:
        return `financial_${objective.uid}_${fyid}`;
      case CUSTOMER_TAB.id:
        return `customer_${objective.uid}_${fyid}`;
      case PROCESS_TAB.id:
        return `process_${objective.uid}_${fyid}`;
      case GROWTH_TAB.id:
        return `learning_${objective.uid}_${fyid}`;
      default:
        return;
    }
  };

  // Retrieve files with  measuredId && folderId OR measureId && createdBy
  useEffect(() => {
    const loadFiles = async () => {
      if (!measure) return;
      setLoading(true);
      const { uid: createdBy, id: measureId } = measure;
      await api.folderFile.getAllByMeasure(createdBy, measureId);
      setLoading(false);
    };

    loadFiles();
  }, [api.folderFile, measure]);

  return (
    <div className="measure-files-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">{measureTitle}</h3>

      <div className="dialog-content uk-position-relative">
        <div className="uk-form-stacked uk-grid-small" data-uk-grid>
          <MeasureFiles loading={loading} files={files} />
          <Uploader onSave={onSave} />
        </div>
      </div>
    </div>
  );
});

export default MeasureFilesModal;

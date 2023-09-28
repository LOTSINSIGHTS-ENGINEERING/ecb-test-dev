import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { faArrowUpFromBracket, faFileDownload, faFilePdf, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FolderFile from "../../../shared/models/FolderFile";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

interface IFileProps {
  document: FolderFile;
}

const Document = (props: IFileProps) => {
  const document = props.document;
  const { name, url } = document.asJson;

  const onDelete = () => {
    document.remove();
  };

  return (
    <label className="measure__file">
      <div className="measure__file__icon">
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
      </div>
      <p className="measure__file__name">{name}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="measure__file__download kit-btn-text"
      >
        <FontAwesomeIcon className="icon" icon={faFileDownload} size="lg" />
      </a>
      <button className="measure__file__delete kit-btn-text" onClick={onDelete}>
        <FontAwesomeIcon className="icon" icon={faTrashAlt} size="lg" />
      </button>
    </label>
  );
};

interface IMeasureFilesProps {
  loading: boolean;
  files: FolderFile[];
}
export const MeasureFiles = (props: IMeasureFilesProps) => {
  const { files, loading } = props;

  if (loading)
    return (
      <div className="uk-width-1-1">
        <LoadingEllipsis />
      </div>
    );

  return (
    <div className="measure-modal__files uk-width-1-1">
      {files.map((document) => (
        <Document key={document.asJson.id} document={document} />
      ))}

      {files.length === 0 && (
        <div className="uk-text-center uk-padding">
          <h6>No documents uploaded for this measure 😔.</h6>
        </div>
      )}
    </div>
  );
};

interface IProps {
  onSave: (file: File) => Promise<void>;
}
const PerspectiveWeightForm = observer((props: IProps) => {
  const { onSave } = props;
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files) return;

    upload(files[0]);
  };

  const upload = async (file: File) => {
    setLoading(true);
    try {
      await onSave(file); // save the db.
    } catch (error) {
      setLoading(false);
      throw new Error("Cannot save!.");
    }
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className="measure-modal__files uk-width-1-1">
        <div className="file-uploader uk-text-center">
          <label className="btn btn-sm btn-primary" htmlFor="file-uploader">
            <FontAwesomeIcon
              className="icon uk-margin-small-right"
              icon={faArrowUpFromBracket}
            />
            {loading ? "Uploading..." : "Upload File"}
            <input
              id="file-uploader"
              type="file"
              onChange={onFileChange}
              disabled={loading}
            />
          </label>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default PerspectiveWeightForm;

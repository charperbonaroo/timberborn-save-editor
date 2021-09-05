import { FormEvent, useCallback, useState } from "react";
import { DemoSave } from "./DemoSave";

export function LoadSaveCard({ onSaveLoaded }: { onSaveLoaded: (save: DemoSave) => void }) {
  const [ error, setError ] = useState<unknown>();

  const onInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    try {
      const fileList = (event.target as HTMLInputElement|null)?.files;
      const file = fileList?.item(0);
      if (!file) {
        throw new Error(`Expected file to be uploaded, found none`);
      }
      const reader = new FileReader();
      reader.onload = (_event) => {
        try {
          const data = JSON.parse(reader.result as string);
          data.__originalFilename = file.name;
          onSaveLoaded(data);
        } catch (error) {
          setError(error);
          throw error;
        }
      }
      reader.readAsText(file, "utf-8");
    } catch (error) {
      setError(error);
      throw error;
    }
  }, [onSaveLoaded, setError]);

  return <div className="container my-4">
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <label className="card">
          <div className="card-body">
            <h1 className="card-title">Timberborn Save Editor</h1>
            <div className="mb-3">
              <span className="form-label">Upload your <b>Demo save</b> to start</span>
              <input type="file" name="save" accept=".json" onInput={onInput} className="form-control" />
              {error
                ? <small className="form-text">{`#{error}`}</small>
                : <small className="form-text">Default directory: <code>%USERPROFILE%\Documents\Timberborn\DemoSaves\</code></small>}
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
}

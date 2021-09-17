import { useMemo, useState } from "react";
import { DemoSave } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";

export const DownloadPlugin: IEditorPlugin<DemoSave, DemoSave> = {
  id: "DownloadPlugin",
  name: "Download",
  group: "General",
  position: -Infinity,
  enabled: true,

  read(saveData) {
    return saveData;
  },

  write(saveData, data) {
    throw new Error(`Not implemented`);
  },

  Preview({ saveData }) {
    return <strong>Click here to download your modified save!</strong>;
  },

  Editor({ initialData: saveData, onClose }) {

    saveData = {
      ...saveData,
      GameVersion: saveData.GameVersion.replace(/-TSE$/, "") + "-TSE",
      Editor: "https://charperbonaroo.github.io/timberborn-save-editor/",
    }

    const blob = useMemo(() => new Blob([JSON.stringify(saveData)], {type: 'application/json'}), [saveData]);
    const url = URL.createObjectURL(blob);


    const [filename, setFilename] = useState<string>(() => {
      const now = new Date();
      return `${saveData.__originalFilename.replace(".json", "")} MODDED ${now.toISOString().substr(0, 10)} ${now.getHours()}h${now.getMinutes()}m.json`;
    });

    return <div className="container">
      <div className="card my-4">
        <div className="card-body">
          <h1 className="card-title">Download</h1>
          <div className="my-3">
            <label htmlFor="filename" className="form-label">Filename</label>
            <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} id="filename" className="form-control" />
          </div>
          <div className="d-flex">
            <a href={url} download={filename.endsWith(".json") ? filename : filename + ".json"} className="btn btn-primary" onClick={() => onClose()}>Download</a>
            <button type="button" className="btn btn-light ms-auto" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>;
  }
}

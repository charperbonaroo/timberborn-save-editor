import { FormEvent, useCallback, useState } from "react";
import { deepCopy } from "./deepCopy";
import { DemoSave } from "./DemoSave";

const exampleDemoPlains256x256 = require("./examples/demo-plains-256x256.json");
const exampleDemoCanyon128x128 = require("./examples/demo-canyon-128x128.json");
const exmapleDemoLetsPlay = require("./examples/demo-lets-play.json");

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

  const loadExample = useCallback((filename: string, data: DemoSave) => {
    data.__originalFilename = filename;
    onSaveLoaded(deepCopy(data));
  }, [onSaveLoaded]);

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
            <hr />
            <small className="form-text">Or load an example save</small>
            <br />
            <button className="btn btn-link" onClick={(e) => loadExample("demo-plains-256x256.json", exampleDemoPlains256x256)}>Demo Plains 256x256</button>
            <button className="btn btn-link" onClick={(e) => loadExample("demo-canyon-128x128.json", exampleDemoCanyon128x128)}>Demo Canyon 128x128</button>
            <button className="btn btn-link" onClick={(e) => loadExample("demo-lets-play-256x256.json", exmapleDemoLetsPlay)}>Lets Play 256x256</button>
          </div>
        </label>
      </div>
    </div>
  </div>
}

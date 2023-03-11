import JSZip from "jszip";
import { FormEvent, useCallback, useState } from "react";
import { deepCopy } from "./deepCopy";
import { DemoSave } from "./DemoSave";

const exmapleLetsPlay = require("./examples/lets-play-plains.json");
const exampleIronTeeth = require("./examples/iron-teeth-plains-1-1.json");

export function LoadSaveCard({ onSaveLoaded }: { onSaveLoaded: (save: DemoSave) => void }) {
  const [error, setError] = useState<unknown>();

  const onInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    try {
      const fileList = (event.target as HTMLInputElement | null)?.files;
      const file = fileList?.item(0);
      if (!file) {
        throw new Error(`Expected file to be uploaded, found none`);
      }

      const loadJson = (json: string) => {
        try {
          const data = JSON.parse(json);
          data.__originalFilename = file.name;
          console.log(data);
          onSaveLoaded(data);
        } catch (error) {
          setError(error);
          throw error;
        }
      }

      if (/\.json$/.test(file.name)) {
        const reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.onload = (_event) => {
          loadJson(reader.result as string);
        }
      } else if (/\.timber$/.test(file.name)) {
        new JSZip().loadAsync(file).then((zip) => {
          const file = Object.values(zip.files)[0];
          return file.async("string");
        }).then((json) => {
          loadJson(json);
        }).catch((error) => {
          setError(error);
          throw error;
        });
      }
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
        <div className="card">
          <label className="card-body">
            <small className="text-danger">A very unofficial &amp; third-party</small>
            <h1 className="card-title">Timberborn Save Editor</h1>
            <div className="mb-3 mt-4">
              <span className="form-label">Upload your save file to start</span>
              <input type="file" name="save" accept=".json,.timber" onInput={onInput} className="form-control" />
              {error
                ? <small className="form-text">{`#{error}`}</small>
                : <small className="form-text">Default directory: <code>%USERPROFILE%\Documents\Timberborn\Saves\</code></small>}
            </div>
            <b>Now works with <code>.timber</code> files!</b>
          </label>
          <div className="card-body">
            <small className="form-text">Or load an example save</small>
            <br />
            <button className="btn btn-link" onClick={(e) => loadExample("iron-teeth-plains-1-1.json", exampleIronTeeth)}>Iron Teeth 1-1 Plains 256x256</button>
            <button className="btn btn-link" onClick={(e) => loadExample("lets-play-plains.json", exmapleLetsPlay)}>Lets Play Plains 256x256</button>
          </div>
        </div>
        <div className="p-2 text-center">
          <small className="form-text">
            This editor is made by <a href="https://bonaroo.nl/" rel="noreferrer" target="_blank">Charper Bonaroo BV</a> and is not officially
            supported by Timberborn. Charper Bonaroo BV is not affiliated with Mechanistry.
            <br />
            <br />
            <a className="btn btn-sm btn-link" rel="noreferrer" href="https://github.com/charperbonaroo/timberborn-save-editor" target="_blank">Github</a>
            {" "}
            <a className="btn btn-sm btn-link" href="mailto:toby@bonaroo.nl">Contact</a>
            {" "}
            <span className="btn-sm" style={{ display: "inline-block", lineHeight: "1.5", verticalAlign: "middle" }}>Discord: <b>gamebuster800#2213</b></span>
          </small>
        </div>
        <div className="text-muted" style={{ fontFamily: "monospace", fontSize: "10pt" }}>
          <p>
            <b>Changelog</b>
          </p>
          <p>
            <b>2023-03-11</b>
          </p>
          <p>
            Thank you for using this tool. You can request features or bugfixes via Github!
            We're not playing Timberborn ourselves at this moment, so please do let us know
            about any issues!
          </p>
          <ul>
            <li>Change "Finish" behavior to prevent the game from crashing sometimes</li>
            <li>Add "Finish All" button</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
}

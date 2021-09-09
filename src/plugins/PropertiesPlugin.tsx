import { fromJS, Map } from "immutable";
import { get } from "lodash";
import { useState } from "react";
import { DemoSave } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";

type Singletons = DemoSave["Singletons"];

const fields = [{
  label: "Science",
  path: ["ScienceService", "SciencePoints"],
  type: "number",
  parse: (value: string) => parseInt(value, 10),
  id: "science-points",
}, {
  label: "Cycle",
  path: ["CycleService", "Cycle"],
  type: "number",
  parse: (value: string) => parseInt(value, 10),
  id: "cycle",
}, {
  label: "Cycle Day",
  path: ["CycleService", "CycleDay"],
  type: "number",
  parse: (value: string) => parseInt(value, 10),
  id: "cycle-day",
}, {
  label: "Wet season duration",
  path: ["CycleService", "WetSeasonDuration"],
  type: "number",
  parse: (value: string) => parseInt(value, 10),
  id: "wet-season-duration",
}, {
  label: "Dry season duration",
  path: ["CycleService", "DrySeasonDuration"],
  type: "number",
  parse: (value: string) => parseInt(value, 10),
  id: "dry-season-duration",
}];

export const PropertiesPlugin: IEditorPlugin<Singletons, Singletons> = {
  read: (saveData) => saveData.Singletons,
  write: (saveData, data) => ({ ...saveData, Singletons: data }),
  position: 0,
  id: "PropertiesPlugin",
  name: "Properties",
  group: "General",
  enabled: true,
  Preview: ({ saveData }) => {
    return <div>
      {fields.map((_) => <div>{_.label}: <strong>{get(saveData.Singletons, _.path)}</strong></div>)}
    </div>;
  },
  Editor: ({ initialData, onClose, onSubmit }) => {
    const [data, setData] = useState(fromJS(initialData) as Map<string, any>);

    return <form onSubmit={(e) => { e.preventDefault(); onSubmit(data.toJS() as Singletons); }}>
      <div className="container">
        <div className="card my-4">
          <div className="card-body">
            <h1 className="card-title">Properties</h1>
            {fields.map(({ path, type, parse, id, label }) => <div key={id} className="mb-3">
              <label htmlFor={id} className="form-label">{label}</label>
              <input id={id} type={type} className="form-control"
                value={data.getIn(path) as string}
                onInput={(e) => setData(data.setIn(path, parse((e.target as HTMLInputElement).value)))} />
            </div>)}
            <div className="d-flex">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-light ms-auto" onClick={onClose}>Discard changes</button>
            </div>
          </div>
        </div>
      </div>
    </form>;
  }
}

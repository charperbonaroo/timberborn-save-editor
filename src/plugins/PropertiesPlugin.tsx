import { fromJS, Map } from "immutable";
import { get } from "lodash";
import { useState } from "react";
import { DemoSave } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";

type Singletons = DemoSave["Singletons"];

interface InputDef {
  label: string;
  path: Array<string|number>;
  type: "number"|"text";
  parse: (value: string) => any;
  step?: string;
}

interface HeaderDef {
  label: string;
  type: "header";
}

type FieldDefinition = InputDef|HeaderDef;

const parseIntValue = (value: string) => parseInt(value, 10);

const fields: FieldDefinition[] = [{
  label: "Science",
  path: ["ScienceService", "SciencePoints"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Cycle & Day",
  type: "header",
}, {
  label: "Cycle",
  path: ["WeatherService", "Cycle"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Cycle day",
  path: ["WeatherService", "CycleDay"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Temperate weather duration",
  path: ["WeatherService", "TemperateWeatherDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Drought duration",
  path: ["WeatherService", "DroughtDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Weather Duration",
  type: "header",
}, {
  label: "Min temperate weather duration",
  path: ["WeatherDurationService", "MinTemperateWeatherDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Max temperate weather duration",
  path: ["WeatherDurationService", "MaxTemperateWeatherDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Min drought duration",
  path: ["WeatherDurationService", "MinDroughtDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Max drought duration",
  path: ["WeatherDurationService", "MaxDroughtDuration"],
  type: "number",
  parse: parseIntValue,
}, {
  label: "Handicap multiplier",
  path: ["WeatherDurationService", "HandicapMultiplier"],
  type: "number",
  parse: parseFloat,
  step: "0.1",
}, {
  label: "Handicap cycles",
  path: ["WeatherDurationService", "HandicapCycles"],
  type: "number",
  parse: parseIntValue,
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
    return <div className="row">
      {(fields.filter((_) => _.type !== "header") as InputDef[])
        .map((_) => <div className="col-4" key={(_.path.join("."))}>{_.label}: <strong>{get(saveData.Singletons, _.path)}</strong></div>)}
    </div>;
  },
  Editor: ({ initialData, onClose, onSubmit }) => {
    const [data, setData] = useState(fromJS(initialData) as Map<string, any>);

    return <form onSubmit={(e) => { e.preventDefault(); onSubmit(data.toJS() as Singletons); }}>
      <div className="container">
        <div className="card my-4">
          <div className="card-body">
            <h1 className="card-title">Properties</h1>
            <div className="row">
              {fields.map((field) => {
                if (field.type === "header") {
                  return <h5 key={field.label} className="mb-1 col-12">{field.label}</h5>
                } else {
                  const { path, type, parse, label } = field;
                  const id = path.join(".")
                  return <div key={id} className="mb-3 col-4">
                    <label htmlFor={id} className="form-label form-label-sm">{label}</label>
                    <input id={id} type={type} className="form-control form-control-sm"
                      value={data.getIn(path) as string} step={field.step}
                      onInput={(e) => setData(data.setIn(path, parse((e.target as HTMLInputElement).value)))} />
                  </div>;
                }
              })}
            </div>
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

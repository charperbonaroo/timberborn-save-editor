import { useState } from "react";
import { IEditorPlugin } from "../IEditorPlugin";

interface MapSizeParams {
  x: number;
  y: number;
}

export const MapSizePlugin: IEditorPlugin<MapSizeParams, MapSizeParams> = {
  id: "MapSizePlugin",
  name: "Map size",
  group: "General",
  position: -1,
  enabled: true,

  read(saveData) {
    const x = saveData.Singletons.MapSize.Size.X;
    const y = saveData.Singletons.MapSize.Size.Y;
    return { x, y };
  },

  write(saveData, data) {
    saveData.Singletons.MapSize.Size.X = data.x;
    saveData.Singletons.MapSize.Size.Y = data.y;
    return saveData;
  },

  Preview({ saveData }) {
    const x = saveData.Singletons.MapSize.Size.X;
    const y = saveData.Singletons.MapSize.Size.Y;
    return <span>
      <strong>{x}</strong> &times; <strong>{y}</strong>
    </span>;
  },

  Editor({ initialData, onClose, onSubmit }) {
    const [data, setData] = useState(initialData);

    return <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <div className="container">
        <div className="card my-4">
          <div className="card-body">
            <h1 className="card-title">Map size editor</h1>
            <p>This is just a demo editor - changing this will likely break something.</p>
            <div className="mb-3">
              <label htmlFor="x" className="form-label">X</label>
              <input id="x" type="number" className="form-control" value={data.x} onInput={(e) => setData({ ...data, x: parseInt((e.target as HTMLInputElement).value, 10) })} />
            </div>
            <div className="mb-3">
              <label htmlFor="y" className="form-label">Y</label>
              <input id="y" type="number" className="form-control" value={data.y} onInput={(e) => setData({ ...data, y: parseInt((e.target as HTMLInputElement).value, 10) })} />
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

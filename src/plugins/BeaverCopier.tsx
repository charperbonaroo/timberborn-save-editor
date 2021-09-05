import { sample, sortBy } from "lodash";
import { useCallback, useState } from "react";
import { deepCopy } from "../deepCopy";
import { DemoSave, DemoSaveEntity, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";
import { UUID } from "../util/UUID";

export const BeaverCopier: IEditorPlugin<DemoSave, DemoSave> = {
  id: "BeaverCopier",
  name: "Beaver copier",
  group: "Beavers",
  enabled: true,

  read(saveData) {
    return saveData;
  },

  write(saveData, data) {
    return data;
  },

  Preview({ saveData }) {
    return <BeaverStatus entities={saveData.Entities} />;
  },

  Editor({ initialData, onClose, onSubmit }) {
    const names = initialData.Singletons.NameService.Names;
    const [ beavers, setBeavers ] = useState(() => initialData.Entities.filter(_ => _.TemplateName === "BeaverChild" || _.TemplateName === "BeaverAdult"))
    const [ page, setPage ] = useState(0);
    const [ pageSize, setPageSize ] = useState(10);
    const [ addRandomAmount, setAddRandomAmount ] = useState(1);

    const sortedBeavers = sortBy(beavers.slice(), _ => -(_ as any).Components.Beaver.DayOfBirth);

    const offset = page * pageSize;

    const duplicate = useCallback((beaver: UnknownEntity) => {
      const newBeaver = deepCopy(beaver);
      const id = UUID();
      newBeaver.Id = id;
      newBeaver.Components.BehaviorManager = {};
      (newBeaver.Components as any).Beaver.Name = sample(names);
      const newBeavers = beavers.slice();
      newBeavers.push(newBeaver);
      setBeavers(newBeavers);
    }, [beavers, setBeavers, names]);

    const doSubmit = useCallback(() => {
      const Entities = initialData.Entities
        .filter(_ => _.TemplateName !== "BeaverChild" && _.TemplateName !== "BeaverAdult")
        .concat(beavers);

      onSubmit({ ...initialData, Entities });
    }, [onSubmit, beavers, initialData]);

    const hasNextPage = pageSize + offset < beavers.length;

    const doAddRandomBeavers = useCallback(() => {
      const newBeavers = beavers.slice();
      for (let i = 0; i < addRandomAmount; i++) {
        const newBeaver = deepCopy(sample(beavers)!);
        const id = UUID();
        newBeaver.Id = id;
        newBeaver.Components.BehaviorManager = {};
        (newBeaver.Components as any).Beaver.Name = sample(names);
        newBeavers.push(newBeaver);
      }
      setBeavers(newBeavers);
    }, [beavers, addRandomAmount, names]);

    return <div className="container my-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Beaver Copier</h1>
          <div className="d-flex">
            <div>
              <BeaverStatus entities={beavers} />
            </div>
            <div className="ms-auto">
              <button type="button" onClick={onClose} className="btn btn-light">Discard changes</button>
              {" "}
              <button type="button" onClick={doSubmit} className="btn btn-primary">Submit</button>
            </div>
          </div>
          {beavers.length > 80 ? <div className="alert alert-danger mt-1">
            <b>WARNING:</b> You have {beavers.length} beavers. Newer versions of
            the Timberborn Demo will randomly crash with over 80 beavers.
          </div> : null}
        </div>
        <table className="table my-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age <small style={{fontWeight: "normal"}}>a-z</small></th>
              <th>Coordinates</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedBeavers.slice(offset, offset + pageSize).map((beaver: any) => <tr key={beaver.Id}>
              <td>{beaver.Components.Beaver.Name}</td>
              <td>{initialData.Singletons.DayNightCycle.DayNumber - beaver.Components.Beaver.DayOfBirth} {beaver.TemplateName === "BeaverChild" ? <small>(child)</small> : null}</td>
              <td>
                x: <b>{Math.round(beaver.Components.Beaver.Position.X)}</b>{" "}
                y: <b>{Math.round(beaver.Components.Beaver.Position.Y)}</b>{" "}
                z: <b>{Math.round(beaver.Components.Beaver.Position.Z)}</b>{" "}
              </td>
              <td className="text-end py-1">
                <button type="button" className="btn btn-light btn-sm" onClick={() => duplicate(beaver)}>Copy</button>
              </td>
            </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="py-1">
                <div className="d-flex">
                  <div className="me-auto">
                    Showing <strong>{offset}</strong> - <strong>{Math.min(beavers.length, offset + pageSize)}</strong> of <strong>{beavers.length}</strong>
                  </div>
                  <form className="me-3 d-flex" onSubmit={(event) => { event.preventDefault(); doAddRandomBeavers(); }}>
                    <label className="form-label me-1 mt-1 mb-0" htmlFor="addRandom">Add beaver(s)</label>
                    <input type="number" id="addRandom" className="form-control form-control-sm" value={addRandomAmount}
                      onChange={(event) => { setAddRandomAmount(parseInt(event.target.value, 10)) }} width={3} style={{width: 60}} />
                    <button type="submit" className="ms-1 btn btn-primary btn-sm">Add</button>
                  </form>
                  <div className="me-3 d-flex">
                    <label className="form-label me-1 mt-1 mb-0" htmlFor="pageSize">Pagesize</label>
                    <select id="pageSize" className="form-control form-control-sm" value={pageSize} onChange={(event) => { setPage(0); setPageSize(parseInt(event.target.value, 10)) }}>
                      <option>10</option>
                      <option>25</option>
                      <option>100</option>
                      <option>250</option>
                      <option>1000</option>
                      <option value={`${Number.MAX_SAFE_INTEGER}`}>ALL</option>
                    </select>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-light" disabled={page<=0} onClick={() => setPage(page-1)}>&lsaquo; prev</button>
                    {" "}
                    <button className="btn btn-sm btn-light" disabled={!hasNextPage} onClick={() => setPage(page+1)}>next &rsaquo;</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>;
  }
}

function BeaverStatus({entities}: {entities: DemoSaveEntity[]}) {
  const {adultCount, childCount} = entities.reduce((acc, entity) => {
    if (entity.TemplateName === "BeaverAdult") {
      acc.adultCount++;
    }
    if (entity.TemplateName === "BeaverChild") {
      acc.childCount++;
    }
    return acc;
  }, { adultCount: 0, childCount: 0 })

  const sum = adultCount+childCount;

  return <span>You have <strong>{sum}</strong> beavers: <strong>{childCount}</strong> kits and <strong>{adultCount}</strong> adults.</span>;

}

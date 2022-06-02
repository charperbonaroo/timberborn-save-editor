import { sample, sortBy } from "lodash";
import { useCallback, useState, useMemo } from "react";
import { BeaverUtil } from "../BeaverUtil";
import { deepCopy } from "../deepCopy";
import { DemoSave, DemoSaveEntity, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";

export const BeaverCopier: IEditorPlugin<DemoSave, DemoSave> = {
  id: "BeaverCopier",
  name: "Beaver copier",
  group: "Beavers",
  position: 1,
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
    const [beavers, setBeavers] = useState(() => initialData.Entities.filter(_ => _.Template === "BeaverChild" || _.Template === "BeaverAdult"))
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [targetAmount, setTargetAmount] = useState(70);
    const [beaverId, setBeaverId] = useState<string | null>(null);

    const sortedBeavers = sortBy(beavers.slice(), _ => -(_ as any).Components.Character.DayOfBirth);

    const offset = page * pageSize;

    const copyBeaver = useCallback((beaver: UnknownEntity) => {
      const newBeaver = deepCopy(beaver);
      BeaverUtil.reset(newBeaver);
      BeaverUtil.setDefaultName(initialData, newBeaver);
      if (newBeaver.Template === "BeaverAdult") {
        BeaverUtil.setAge(initialData, beaver, 5)
      }
      return newBeaver;
    }, [initialData]);

    const duplicate = useCallback((beaver: UnknownEntity) => {
      setBeavers(beavers.slice().concat([copyBeaver(beaver)]));
    }, [beavers, setBeavers, copyBeaver]);

    const doSubmit = useCallback(() => {
      const Entities = initialData.Entities
        .filter(_ => _.Template !== "BeaverChild" && _.Template !== "BeaverAdult")
        .concat(beavers);

      onSubmit({ ...initialData, Entities });
    }, [onSubmit, beavers, initialData]);

    const hasNextPage = pageSize + offset < beavers.length;

    const doSetBeaverCount = useCallback(() => {
      const adults = beavers.filter(_ => _.Template === "BeaverAdult");
      const newBeavers = beavers.slice();
      for (const beaver of newBeavers) {
        BeaverUtil.setDefaultNeeds(beaver);
      }
      while (newBeavers.length < targetAmount) {
        newBeavers.push(copyBeaver(sample(adults)!));
      }
      setBeavers(newBeavers);
    }, [beavers, targetAmount, copyBeaver]);

    const editingBeaver = useMemo(() => beavers.find(_ => _.Id === beaverId), [beavers, beaverId]);

    const updateBeaver = useCallback((patch: any) => {
      const index = beavers.findIndex(_ => _.Id === beaverId);
      const newBeaver = deepCopy(beavers[index]);
      if (patch.Name) {
        BeaverUtil.setName(newBeaver, patch.Name);
      }
      const newBeavers = beavers.slice();
      newBeavers[index] = newBeaver;
      setBeavers(newBeavers);
    }, [beaverId, beavers]);

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
          <div className={["collapse", beaverId ? "show" : ""].join(" ")}>
            {beaverId && <BeaverEditor beaver={editingBeaver} updateBeaver={updateBeaver} />}
          </div>
        </div>
        <table className="table my-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age <small style={{ fontWeight: "normal" }}>a-z</small></th>
              <th>Coordinates</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedBeavers.slice(offset, offset + pageSize).map((beaver: any) => <tr key={beaver.Id}>
              <td>{beaver.Components.Character.Name}</td>
              <td>{initialData.Singletons.DayNightCycle.DayNumber - beaver.Components.Character.DayOfBirth} {beaver.Template === "BeaverChild" ? <small>(child)</small> : null}</td>
              <td>
                x: <b>{Math.round(beaver.Components.Character.Position.X)}</b>{" "}
                y: <b>{Math.round(beaver.Components.Character.Position.Y)}</b>{" "}
                z: <b>{Math.round(beaver.Components.Character.Position.Z)}</b>{" "}
              </td>
              <td className="text-end py-1">
                <button type="button" onClick={() => setBeaverId(beaver.Id)} className="btn btn-light btn-sm">Edit</button>
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
                  <form className="me-3 d-flex" onSubmit={(event) => { event.preventDefault(); doSetBeaverCount(); }}>
                    <label className="form-label me-1 mt-1 mb-0" htmlFor="addRandom">Set beavers</label>
                    <input type="number" id="addRandom" className="form-control form-control-sm" value={targetAmount}
                      onChange={(event) => { setTargetAmount(parseInt(event.target.value, 10)) }} width={3} style={{ width: 80 }} />
                    <button type="submit" className="ms-1 btn btn-primary btn-sm">Set</button>
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
                    <button className="btn btn-sm btn-light" disabled={page <= 0} onClick={() => setPage(page - 1)}>&lsaquo; prev</button>
                    {" "}
                    <button className="btn btn-sm btn-light" disabled={!hasNextPage} onClick={() => setPage(page + 1)}>next &rsaquo;</button>
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

function BeaverStatus({ entities }: { entities: DemoSaveEntity[] }) {
  const { adultCount, childCount } = entities.reduce((acc, entity) => {
    if (entity.Template === "BeaverAdult") {
      acc.adultCount++;
    }
    if (entity.Template === "BeaverChild") {
      acc.childCount++;
    }
    return acc;
  }, { adultCount: 0, childCount: 0 })

  const sum = adultCount + childCount;

  return <span>You have <strong>{sum}</strong> beavers: <strong>{childCount}</strong> kits and <strong>{adultCount}</strong> adults.</span>;
}

function BeaverEditor({ beaver, updateBeaver }: { beaver?: any, updateBeaver: (patch: any) => void }) {
  const [beaverData, setBeaverData] = useState(deepCopy(beaver.Components.Character));
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    updateBeaver(beaverData);
  }, [beaverData, updateBeaver]);

  const updateBeaverData = useCallback((property: string, value: any) => {
    setBeaverData({ ...beaverData, [property]: value });
  }, [beaverData]);

  if (!beaver) return <div className="text-danger p-1">Invalid beaver selected!</div>;

  return <>
    <h2>Edit beaver</h2>
    <form className="my-3 d-flex" onSubmit={onSubmit}>
      <label className="form-label me-1 mt-1 mb-0" htmlFor="beaverEditName">Name</label>
      <input className="form-control form-control-sm" id="beaverEditName" value={beaverData.Name} minLength={1} onChange={(e) => updateBeaverData("Name", e.target.value)} />
      <button name="submit" type="submit" className="btn btn-primary btn-sm ms-auto">Update</button>
    </form>
  </>;
}

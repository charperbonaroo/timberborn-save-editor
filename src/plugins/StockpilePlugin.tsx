import { assign, chunk, fill, groupBy, mapValues, toPairs } from "lodash";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { DemoSave, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";
import { StockpileUtil } from "../StockpileUtil";

export const StockpilePlugin: IEditorPlugin<DemoSave, DemoSave> = {
  id: "StockpilePlugin",
  name: "Manage stockpile inventories",
  group: "Storage",
  position: 10,
  enabled: true,

  read: (save) => save,
  write: (_, data) => data,

  Preview: ({ saveData }) => {
    const stockpiles = useMemo(() => StockpileUtil.getStockpiles(saveData), [saveData]);
    const allGoods = useMemo(() => stockpiles.reduce((acc, stockpile) => StockpileUtil.countGoods(stockpile, acc), {} as Record<string, number>), [stockpiles]);

    return <div>
      <StockpileInventoryTable counts={allGoods} />
    </div>
  },

  Editor: ({ initialData, onClose, onSubmit }) => {
    const [ stockpileId, setStockpileId ] = useState<string|null>(null);
    const [ stockpiles, setStockpiles ] = useState(() => StockpileUtil.getStockpiles(initialData));

    const setStockpile = useCallback((stockpile: UnknownEntity) => {
      setStockpiles(stockpiles.slice().map((_) => _.Id === stockpile.Id ? stockpile : _));
      setStockpileId(null);
    }, [setStockpiles, stockpiles, setStockpileId])

    const doSubmit = useCallback(() => {
      const mappedStockpiles = mapValues(groupBy(stockpiles, "Id"), (arr) => arr[0]);

      onSubmit({
        ...initialData,
        Entities: initialData.Entities.map((_) => mappedStockpiles[_.Id] ? mappedStockpiles[_.Id] : _),
      });
    }, [onSubmit, initialData, stockpiles]);

    return <div className="container my-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Manage stockpile inventories</h1>
          <div className="d-flex">
            <button type="button" className="btn btn-primary" onClick={doSubmit}>Submit</button>
            <button type="button" className="btn btn-light ms-auto" onClick={onClose}>Discard changes</button>
          </div>
        </div>
        <div className="list-group list-group-flush">
          {stockpiles.map((stockpile) => stockpileId === stockpile.Id
            ? <StockpileForm key={stockpile.Id} setStockpile={setStockpile} stockpile={stockpile} />
            : <StockpileButton key={stockpile.Id} setStockpileId={setStockpileId} stockpile={stockpile} />)}
        </div>
      </div>
    </div>
  }
}

function StockpileForm({ stockpile, setStockpile }: { stockpile: UnknownEntity, setStockpile: (stockpile: UnknownEntity) => void }) {
  const goods: string[] = useMemo(() => (stockpile.Components.GoodDesirer as any).DesiredGoods.map((_: any) => _.Good.Id), [stockpile]);
  const [ counts, setCounts ] = useState(() => StockpileUtil.countGoods(stockpile));

  const onSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    setStockpile({
      ...stockpile,
      Components: {
        ...stockpile.Components,
        "Inventory:Stockpile": {
          Storage: {
            Goods: toPairs(counts).filter(([k,v]) => v && v > 0).map(([Id, Amount]) => ({ Good: {Id}, Amount }))
          }
        }
      }
    })
  }, [stockpile, setStockpile, counts]);


  const setCount = useCallback((good: string, count: number) => {
    setCounts({ ...counts, [good]: count });
  }, [setCounts, counts]);

  return <div className="list-group-item">
    <div className="d-flex">
      <div>
        <b>{stockpile.TemplateName}</b>
        <div>
          x: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.X)}</b>{" "}
          y: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.Y)}</b>{" "}
          z: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.Z)}</b>{" "}
        </div>
      </div>
      <form className="flex-fill" onSubmit={onSubmit}>
        {goods.map((good) => <div key={good} className="row mb-3">
          <label className="col-sm-2 col-form-label col-form-label-sm text-end">{good}</label>
          <div className="col-sm-10">
            <input className="form-control form-control-sm" type="number" onChange={(event) => { setCount(good, event.target.valueAsNumber) }} value={counts[good] || ""} />
          </div>
        </div>)}
        <div className="row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary btn-sm">OK</button>
          </div>
        </div>
      </form>
    </div>
  </div>
}

function StockpileButton({ stockpile, setStockpileId }: { stockpile: UnknownEntity, setStockpileId: (id: string) => void }) {
  return <button onClick={() => setStockpileId(stockpile.Id)} className="list-group-item list-group-item-action">
    <div className="d-flex">
      <div>
        <b>{stockpile.TemplateName}</b>
        <div>
          x: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.X)}</b>{" "}
          y: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.Y)}</b>{" "}
          z: <b>{Math.round((stockpile.Components.BlockObject as any).Coordinates.Z)}</b>{" "}
        </div>
      </div>
      <StockpileInventoryTable counts={StockpileUtil.countGoods(stockpile)} />
    </div>
  </button>;
}

function StockpileInventoryTable({ counts }: { counts: Record<string, number> }) {
  return <table className="table table-sm table-borderless my-0">
    <tbody>
      {chunk(toPairs(counts), 5).map((chunk, index) => <tr key={index}>
        {assign(fill(new Array(5), ["", ""]), chunk).map(([label, value], i) => <>
          <th style={{width: "17%"}} key={"k"+i} className="text-end">{label}</th>
          <td style={{width: "3%"}} className="text-end" key={"v"+i}>{value}</td>
        </>)}
      </tr>)}
    </tbody>
  </table>;
}

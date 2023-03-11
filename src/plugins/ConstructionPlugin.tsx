import React, { useMemo, useState, Fragment, useCallback } from "react";
import { assign, chunk, concat, fill, groupBy, toPairs, uniq } from "lodash";
import { DemoSave } from "../DemoSave";
import { deepCopy } from "../deepCopy";
import { IEditorPlugin } from "../IEditorPlugin";
import { ConstructionUtil } from "../ConstructionUtil";

interface BuildingSort {
  column: string;
  descending: boolean;
}
interface BuildingFilter {
  column: string;
  value: string;
}
interface BuildingData {
  Template: string;
  type: string;
  Id: string;
  coords: {
    X: number;
    Y: number;
    Z: number;
  };
  finished: boolean;
}
type BuildingDataDict = { [id: string]: BuildingData[] };

export const ConstructionPlugin: IEditorPlugin<DemoSave, DemoSave> = {
  id: "ConstructionPlugin",
  name: "Manage active constructions",
  group: "Construction",
  position: 10,
  enabled: true,

  read: (save) => save,
  write: (_, data) => data,

  Preview: ({ saveData }) => {
    (window as any).__saveData = saveData;
    console.log(saveData);
    const constructionSites = useMemo(() => ConstructionUtil.getConstructionSites(saveData), [saveData]);

    const constructionGroups = useMemo(() => {
      const groups: Record<string, number> = {};
      Object.entries(groupBy(constructionSites, (_) => _.Template)).forEach(([template, sites]) => {
        const type = ConstructionUtil.getBuildingType(template);
        if (type === "Other") console.log(template);
        groups[type] = (groups[type] || 0) + sites.length;
      });
      return groups;
    }, [constructionSites]);

    return <>
      <span>You have <strong>{constructionSites.length}</strong> construction sites.</span>
      <ConstructionTypesTable counts={constructionGroups} />
    </>;
  },

  Editor: ({ initialData, onClose, onSubmit }) => {
    const [sort, setSort] = useState<BuildingSort>({ column: "type", descending: false });
    const [filter, setFilter] = useState<BuildingFilter>({ column: "", value: "none" });
    const [constructionSites, setConstructionSites] = useState(() => deepCopy(ConstructionUtil.getConstructionSites(initialData)));
    const buildingData = useMemo<BuildingDataDict>(() =>
      groupBy(constructionSites.map(({ Template, Id, Components }) =>
        ({ Template, type: ConstructionUtil.getBuildingType(Template), Id, coords: Components.BlockObject.Coordinates, finished: Components.Constructible.Finished } as BuildingData)
      ).sort((a, b) => a.Template.localeCompare(b.Template)), ({ type }) => type) as BuildingDataDict, [constructionSites]
    );
    const sortedAndFiltered = useMemo(() => {
      const { column, descending } = sort;
      const { column: filterColumn, value } = filter || { column: "", value: "none" };

      let filtered: BuildingData[] | null = null;
      switch (filterColumn) {
        case "type":
          filtered = buildingData[value];
          break;
        case "building":
          const type = ConstructionUtil.getBuildingType(value);
          filtered = buildingData[type].filter((_) => _.Template === value);
          break;
        default:
          filtered = Object.values(buildingData).flat();
      }

      switch (column) {
        case "type":
          return filtered.sort((a, b) => (descending ? b : a).type.localeCompare((descending ? a : b).type));
        case "building":
          return filtered.sort((a, b) => (descending ? b : a).Template.localeCompare((descending ? a : b).Template));
        default:
          return filtered;
      }
    }, [buildingData, sort, filter]);

    const toggleSort = useCallback((column: "type" | "building", sort: BuildingSort) => {
      if (sort.column === column) {
        setSort({ ...sort, descending: !sort.descending });
        return;
      }
      setSort({ column, descending: false });
    }, []);

    const finishBuildingConstruction = useCallback((e) => {
      const itemId: string = e.currentTarget.parentNode.parentNode.id;
      const newSites = constructionSites.slice();
      const index = newSites.findIndex((_) => _.Id === itemId);

      if (index !== -1) {
        ConstructionUtil.finishConstruction(newSites[index]);
        setConstructionSites(newSites);
      }
    }, [constructionSites]);

    const finishAll = useCallback((e) => {
      const newSites = constructionSites.slice();
      for (const info of sortedAndFiltered) {
        const index = newSites.findIndex((_) => _.Id === info.Id);
        if (index !== -1) {
          ConstructionUtil.finishConstruction(newSites[index]);
        }
      }
      setConstructionSites(newSites);
    }, [sortedAndFiltered, constructionSites]);

    const doSubmit = useCallback(() => {
      const Entities = initialData.Entities
        .filter(ConstructionUtil.reverseEntityFilter)
        .concat(constructionSites);
      onSubmit({ ...initialData, Entities });
    }, [onSubmit, constructionSites, initialData]);

    return <div className="container my-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Manage construction sites</h1>
          <div className="d-flex">
            <span>You have <strong>{constructionSites.length}</strong> construction sites.{filter.column && <> <strong>{sortedAndFiltered.length}</strong> are shown below.</>}</span>
            <div className="ms-auto">
              <button type="button" className="btn btn-light ms-auto" onClick={onClose}>Discard changes</button>
              {" "}
              <button type="button" className="btn btn-primary" onClick={doSubmit}>Submit</button>
            </div>
          </div>
          <div className="mt-3">Be careful when finishing only some construction sites. Finishing buildings without finished buildings below it will result in floating buildings and other weird behaviors!</div>
          <div className="d-flex mt-3">
            <ConstructionTableFilterForm onSubmit={setFilter} buildingData={buildingData} />
            <div className="ms-auto">
              <label className="mb-2">&nbsp;</label>
              <button className="btn btn-primary d-block" onClick={finishAll}>Finish all</button>
            </div>
          </div>
        </div>
        <table className="table my-0">
          <thead>
            <tr>
              <th aria-sort={(sort.column === "" && (sort.descending ? "descending" : "ascending")) || "none"}>
                <span role="button" onClick={() => toggleSort("building", sort)}>Building{sort.column === "building" && <> <small style={{ fontWeight: "normal" }}>{sort.descending ? "z-a" : "a-z"}</small></>}</span>
              </th>
              <th aria-sort={(sort.column === "" && (sort.descending ? "descending" : "ascending")) || "none"}>
                <span role="button" onClick={() => toggleSort("type", sort)}>Type{sort.column === "type" && <> <small style={{ fontWeight: "normal" }}>{sort.descending ? "z-a" : "a-z"}</small></>}</span>
              </th>
              <th>Coordinates</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFiltered.map(({ type, Template, Id, coords, finished }) => <tr key={Id} id={Id}>
              <td>{Template}</td>
              <td>{type}</td>
              <td>
                x: <b>{coords.X}</b>{" "}
                y: <b>{coords.Y}</b>{" "}
                z: <b>{coords.Z}</b>{" "}
              </td>
              <td className="text-end py-1">
                <button type="button" className="btn btn-light btn-sm" onClick={finishBuildingConstruction} disabled={finished}>Finish</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div >;
  },
};

function ConstructionTypesTable({ counts }: { counts: Record<string, number> }) {
  const countsTable = useMemo(() => {
    let sorted = toPairs(counts);
    const otherIndex = sorted.findIndex((_) => _[0] === "Other");
    const other = otherIndex !== -1 ? sorted.splice(otherIndex, 1) : null;
    sorted = sorted.sort(([a], [b]) => a.localeCompare(b));

    return chunk(other ? concat(sorted, other) : sorted, 5).map((chunk, index) => <tr key={index}>
      {assign(fill(new Array(5), ["", ""]), chunk).map(([label, value], i) => <Fragment key={i}>
        <th style={{ width: "17%" }} className="text-end">{label}</th>
        <td style={{ width: "3%" }} className="text-end">{value}</td>
      </Fragment>)}
    </tr>)
  }, [counts]);

  return <table className="table table-sm table-borderless my-0">
    <tbody>
      {countsTable}
    </tbody>
  </table>;
}

function ConstructionTableFilterForm({ onSubmit, buildingData }: { onSubmit: (filter: BuildingFilter) => void, buildingData: BuildingDataDict }) {
  const [filterType, setFilterType] = useState<"type" | "building" | "none">("none");
  const [filterValue, setFilterValue] = useState<string>("none");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(([filterType, filterValue].includes("none") ? { column: "", value: "none" } : { column: filterType, value: filterValue }) as BuildingFilter);
  };

  const valueOptions = useMemo(() => {
    switch (filterType) {
      case "type":
        return Object.values(buildingData).map((arr) => arr[0].type).sort((a, b) => a.localeCompare(b));
      case "building":
        return uniq(Object.values(buildingData).flat().map(({ Template }) => Template)).sort((a, b) => a.localeCompare(b));
      default:
        return [];
    };
  }, [buildingData, filterType]);

  return <form onSubmit={handleSubmit}>
    <div className="d-flex">
      <div className="me-1">
        <label htmlFor="selectFilterType" className="mb-2">Filter by..</label>
        <select className="form-select" id="selectFilterType" onChange={(e) => setFilterType(e.target.value as "type" | "building" | "none")} value={filterType}>
          <option value="none" >None</option>
          <option value="type">Type</option>
          <option value="building">Building</option>
        </select>
      </div>
      <div className="me-1">
        <label htmlFor="selectFilterValue" className="mb-2">With value..</label>
        <select className="form-select" id="selectFilterValue" disabled={filterType === "none"} onChange={(e) => setFilterValue(e.target.value)} value={filterValue}>
          <option value="none" >None</option>
          {valueOptions.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2">&nbsp;</label>
        <button className="d-block btn btn-light" disabled={!filterType || !filterValue}>Apply filter</button>
      </div>
    </div>
  </form>;
}

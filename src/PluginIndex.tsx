import { useMemo } from "react";
import { DemoSave } from "./DemoSave";
import { allPlugins } from "./allPlugins";
import { groupBy, toPairs } from "lodash";

export function PluginIndex({ saveData, onSelectPlugin }: { saveData: DemoSave, onSelectPlugin: (pluginId: string) => void }) {
  const groupedPlugins = useMemo(() => toPairs(groupBy(allPlugins
    .filter(_ => typeof _.enabled === "function" ? _.enabled({saveData}) : _.enabled), "group")), [saveData]);

  return <div className="container">
    {groupedPlugins.map(([groupName, plugins]) => <div key={groupName} className="my-2">
      <h2 className="ps-2">{groupName}</h2>
      <div className="list-group my-2">
      {plugins.map(({ id, name, Preview }) => <button type="button" key={id} onClick={(e) => {e.preventDefault(); onSelectPlugin(id)}} className="list-group-item list-group-item-action">
        <div className="fw-bold">{name}</div>
        <div><Preview saveData={saveData} /></div>
      </button>)}
      </div>
    </div>)}
  </div>
}

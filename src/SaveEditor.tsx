import { useCallback, useState } from "react";
import { DemoSave } from "./DemoSave";
import { PluginIndex } from "./PluginIndex";
import { PluginShow } from "./PluginShow";

export function SaveEditor({ saveData, onSubmit }: { saveData: DemoSave, onSubmit: (saveData: DemoSave) => void }) {
  const [pluginId, setPluginId] = useState<null|string>(null);

  const onSubmitPlugin = useCallback((saveData: DemoSave) => {
    onSubmit(saveData);
    setPluginId(null);
  }, [onSubmit]);

  return pluginId === null
    ? <PluginIndex saveData={saveData} onSelectPlugin={setPluginId} />
    : <PluginShow saveData={saveData} pluginId={pluginId} onClose={() => setPluginId(null)} onSubmit={onSubmitPlugin} />
}

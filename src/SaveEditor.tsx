import { useCallback, useState } from "react";
import { DemoSave } from "./DemoSave";
import { Navbar } from "./Navbar";
import { PluginIndex } from "./PluginIndex";
import { PluginShow } from "./PluginShow";

export function SaveEditor({ saveData, onSubmit }: { saveData: DemoSave, onSubmit: (saveData: DemoSave|null) => void }) {
  const [pluginId, setPluginId] = useState<null|string>(null);

  const onSubmitPlugin = useCallback((saveData: DemoSave) => {
    onSubmit(saveData);
    setPluginId(null);
  }, [onSubmit]);

  const onHome = useCallback(() => {
    if (pluginId) {
      if (window.confirm("Discard changes in this form? Earlier changes will not be discarded.")) {
        setPluginId(null);
      }
    } else if (window.confirm("Close this save file?")) {
      onSubmit(null);
    }
  }, [pluginId, onSubmit]);

  return <>
    <Navbar onHome={onHome} />
    {pluginId === null
      ? <PluginIndex saveData={saveData} onSelectPlugin={setPluginId} />
      : <PluginShow saveData={saveData} pluginId={pluginId} onClose={() => setPluginId(null)} onSubmit={onSubmitPlugin} />}
  </>;
}

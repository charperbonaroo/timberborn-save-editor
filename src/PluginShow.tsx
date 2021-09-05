import { useCallback, useMemo } from "react";
import { DemoSave } from "./DemoSave";
import { allPlugins } from "./allPlugins";
import { deepCopy } from "./deepCopy";

export function PluginShow({ saveData, pluginId, onClose, onSubmit }: { saveData: DemoSave, pluginId: string, onClose: () => void; onSubmit: (save: DemoSave) => void }) {
  const {Editor, read, write} = useMemo(() => allPlugins.find(_ => _.id === pluginId), [pluginId])!;

  const data = useMemo(() => read(deepCopy(saveData)), [read, saveData]);

  const onSubmitData = useCallback((newData: unknown) => {
    onSubmit(deepCopy(write(saveData, newData)));
  }, [write, saveData, onSubmit]);

  return <Editor initialData={data} onClose={onClose} onSubmit={onSubmitData} />;
}

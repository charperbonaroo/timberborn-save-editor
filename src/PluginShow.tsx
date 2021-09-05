import { useCallback, useMemo } from "react";
import { DemoSave } from "./DemoSave";
import { allPlugins } from "./allPlugins";

/**
 * A dirty way to create a deep-copy of a save. The deep copy is usually created
 * to prevent the original copy from being edited or to force a re-render when
 * one of its deep objects might have been updated.
 * @param save
 * @returns
 */
function deepCopy(saveData: DemoSave): DemoSave {
  return JSON.parse(JSON.stringify(saveData));
}

export function PluginShow({ saveData, pluginId, onClose, onSubmit }: { saveData: DemoSave, pluginId: string, onClose: () => void; onSubmit: (save: DemoSave) => void }) {
  const {Editor, read, write} = useMemo(() => allPlugins.find(_ => _.id === pluginId), [pluginId])!;

  const data = useMemo(() => read(deepCopy(saveData)), [read, saveData]);

  const onSubmitData = useCallback((newData: unknown) => {
    onSubmit(deepCopy(write(saveData, newData)));
  }, [write, saveData, onSubmit]);

  return <Editor initialData={data} onClose={onClose} onSubmit={onSubmitData} />;
}

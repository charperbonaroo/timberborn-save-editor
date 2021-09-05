import { DemoSave } from "./DemoSave";

export interface IEditorPlugin<Input, Output> {
  /**
   * Convert the save data to a more managable subset of data, suitable for
   * editing. The return-value will be provided to `editor()`'s `data` argument
   * @param save
   */
  read: (saveData: DemoSave) => Input;

  /**
   * Write the subset of data back to the save. `data` is the data as provided
   * by onSubmit.
   * @param save the save to update
   * @param data the form data to update the save with
   */
  write: (saveData: DemoSave, data: Output) => DemoSave;

  /**
   * Lower number gets placed on top
   */
  position: number;

  /**
   * URL-friendly name of this editor plugin
   */
  id: string;

  /**
   * Human-friendly name of this editor plugin
   */
  name: string;

  /**
   * Forms are grouped by this human-friendly name
   */
  group: string;

  /**
   * Get whether this plugin should be enabled for this save or not
   * @param save
   */
  enabled: boolean|(({ saveData }: IEditorPluginPreview) => boolean);

  /**
   * Render a preview of the data that can be modified
   * @param save
   */
  Preview: ({ saveData }: IEditorPluginPreview) => JSX.Element | null;

  /**
   * Render the editor
   * @param data
   */
  Editor: ({ initialData, onClose, onSubmit }: IEditorPluginEditor<Input, Output>) => JSX.Element | null;
}

export interface IEditorPluginEditor<Input, Output> {
  initialData: Input;
  onClose: () => void;
  onSubmit: (data: Output) => void;
}

export interface IEditorPluginPreview {
  saveData: DemoSave;
}

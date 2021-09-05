import { IEditorPlugin } from "./IEditorPlugin";
import * as pluginsImport from "./plugins";

export const allPlugins: IEditorPlugin<any, any>[] = Object.values(pluginsImport)
  .filter(_ => _ && typeof _ === "object");

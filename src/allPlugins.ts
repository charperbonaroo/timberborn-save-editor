import { sortBy } from "lodash";
import { IEditorPlugin } from "./IEditorPlugin";
import * as pluginsImport from "./plugins";

export const allPlugins: IEditorPlugin<any, any>[] = sortBy(Object
  .values(pluginsImport)
  .filter(_ => _ && typeof _ === "object"), "position");

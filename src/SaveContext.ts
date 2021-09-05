import { createContext } from "react";
import { DemoSave } from "./DemoSave";

export const SaveContext = createContext<{ saveData: DemoSave }>(undefined as any);

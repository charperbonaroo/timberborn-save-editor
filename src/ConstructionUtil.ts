import { DemoSave, UnknownEntity } from "./DemoSave";
import { buildingCategories } from "./allEntities";

interface ConstructibleEntity {
  Id: string;
  Template: string;
  Components: {
    BlockObject: {
      Coordinates: {
        X: number;
        Y: number;
        Z: number;
      };
    };
    Constructible: {
      Finished: boolean;
    };
    ConstructionSite: {
      BuildTimeProgressInHoursKey: number;
    };
    "Inventory:ConstructionSite"?: {
      Storage: {
        Goods: {
          Ammount: number;
          Good: any;
        }[];
      };
    };
    [key: string]: any;
  };
}

const buildingTypes = new Map<string, string>(
  Object.entries(buildingCategories)
    .map(([type, buildings]) => buildings.map((building) => [building, type]))
    .flat() as [string, string][]
);

export const ConstructionUtil = {
  entityFilter: (entity: UnknownEntity) =>
    !!entity.Components.Constructible &&
    !(entity.Components.Constructible as any).Finished,
  reverseEntityFilter: (entity: UnknownEntity) =>
    !entity.Components.Constructible ||
    (entity.Components.Constructible as any).Finished,
  getConstructionSites: (saveData: DemoSave) =>
    saveData.Entities.filter(
      ConstructionUtil.entityFilter
    ) as ConstructibleEntity[],
  getBuildingType: (constructionSite: ConstructibleEntity | string) => {
    const template =
      typeof constructionSite === "string"
        ? constructionSite
        : constructionSite.Template;
    return buildingTypes.get(template) || "Other";
  },
  finishConstruction: (constructionSite: ConstructibleEntity): void => {
    constructionSite.Components.Constructible.Finished = true;
  },
  finishAllConstruction: (saveData: DemoSave): void => {
    saveData.Entities.forEach((entity) => {
      if (
        !!entity.Components.Constructible &&
        !(entity.Components.Constructible as any).Finished
      )
        ConstructionUtil.finishConstruction(entity as ConstructibleEntity);
    });
  },
};

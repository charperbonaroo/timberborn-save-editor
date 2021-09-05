import { sample } from "lodash";
import { DemoSave, UnknownEntity } from "./DemoSave";
import { UUID } from "./util/UUID";

export const BeaverUtil = {
  setAge(saveData: DemoSave, beaver: UnknownEntity, age: number) {
    const dayNumber = saveData.Singletons.DayNightCycle.DayNumber;
    (beaver.Components.Beaver as any).DayOfBirth = Math.floor(dayNumber - age);
  },

  /**
   * Set the default needs for a beaver
   * @param beaver
   */
  setDefaultNeeds(beaver: UnknownEntity): void {
    for (const need of (beaver.Components.NeedManager as any).Needs) {
      if (["Hunger", "Thirst", "Sleep"].includes(need.Name)) {
        need.Points = 1.0;
      }
    }
  },

  setDefaultName(saveData: DemoSave, beaver: UnknownEntity): void {
    const names = saveData.Singletons.NameService.Names;
    (beaver.Components.Beaver as any).Name = sample(names);
  },

  reset(beaver: UnknownEntity) {
    beaver.Id = UUID();
    BeaverUtil.setDefaultNeeds(beaver);
    Object.assign(beaver.Components, {
      BehaviorManager: {
        RunningBehaviorId: "HomelessRootBehavior",
        RunningBehaviorOwner: beaver.Id,
        ReturnToBehavior: false,
        TimestampedBehaviorLog: [
          "HomelessRootBehavior 1.00"
        ]
      },
      MortalNeeder: { DeathDays: [] },
      Worker: {},
    });
  }
}

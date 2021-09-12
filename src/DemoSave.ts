export interface DemoSave {
  __originalFilename: string;
  GameVersion: string;
  Timestamp: string;
  Singletons: {
    MapSize: {Size: {X: number, Y: number}},
    CameraComponent: unknown,
    TerrainMap: {Heights: {Array: string}},
    DayNightCycle: {DayNumber: number, DayProgress: number},
    PlayTimeService: {PlayTime: number},
    DroughtService: {IsDrought: number},
    CycleService: {Cycle: number, CycleDay: number, WetSeasonDuration: number, DrySeasonDuration: number},
    NotificationSaver: {Notifications: unknown[]},
    CameraStateRestorer: unknown,
    WaterMap: {WaterDepths: {Array: string}, Outflows: {Array: string}},
    SoilMoistureSimulator: {MoistureLevels: {Array: string}},
    NameService: {Names: string[]},
    WorkingHoursManager: {WorkedPartOfDay: number},
    WellbeingHighscore: {AverageWellbeingHighscore: number},
    FactionService: {Id: string},
    ScienceService: {SciencePoints: number},
    BuildingUnlockingService: {UnlockedBuildingIds: string[]},
    PlantingService: {PlantingMap: {Size: {X: number, Y: number}}},
    TreeCuttingArea: {CuttingArea: Array<{X: number, Y: number, Z: number}>},
    BeaverStatistics: {BirthCount: number, DeathCount: number},
    NaturalResourceStatistics: {CropsPlanted: number, TreesCut: number},
    GoodStatistics: {Gathered: Array<{Name: string, Value: number}>, Produced: unknown[]},
    FunGameStatistics: {BeaverDays: number},
    TutorialService: {FinishedTutorial: boolean},
  };
  Entities: DemoSaveEntity[];
}

export type DemoSaveEntity = UnknownEntity;

export interface BeaverAdultEntity {
  Id: string;
  TemplateName: "BeaverAdult",
  Components: {
    Beaver: {
      Name: string;
      DayOfBirth: number;
      Position: {X: number, Y: number, Z: number},
      Alive: boolean,
    },
    CharacterModel: {
      Rotation: {X: number, Y: number, Z: number, W: number},
    },
    Mortal: object,
    MovementAnimator: object,
    Worker: object,
    NeedBehaviorPicker: {
      NeedsBeingCriticallySatisfied: unknown[],
    },
    NeedManager: {
      Needs: Array<{ Name: string, Points: number }>,
    },
    GoodCarrier: object,
    Enterer: {CurrentBuilding: string},
    LifeExpectancyManager: {
      SumOfLifeExpectancyObservations: number,
      NumberOfLifeExpectancyObservations: number,
      BaseLifeExpectancy: number,
    },
    BehaviorManager: {
      RunningBehaviorId: string,
      RunningBehaviorOwner: string,
      ReturnToBehavior: boolean,
      RunningExecutorId: string,
      RunningExecutorElapsedTime: number,
      TimestampedBehaviorLog: string[],
    },
    ApplyEffectExecutor: {
      Effects: Array<{NeedId: string, PointsPerHour: number}>,
      FinishTimestamp: number,
      AnimationName: string,
      WasInsideAtLaunch: boolean,
    },
    Walker: object,
    AttractionAttender: {FirstVisit: boolean},
    // many more
  }
}

export interface UnknownEntity {
  Id: string;
  TemplateName: string;
  Components: Record<string, unknown>;
}

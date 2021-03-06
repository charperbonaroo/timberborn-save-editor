import { StockpileUtil } from "./StockpileUtil";

export const entities = {
  PATH_ENTITIES: [
    "Path.Folktails",
    "Path.IronTeeth",
    "Slope",
    "WoodenStairs.Folktails",
    "WoodenStairs.IronTeeth",
    "DistrictGate.Folktails",
    "DistrictGate.IronTeeth",
  ],

  PLATFORM_ENTITIES: [
    "Platform.Folktails",
    "Platform.IronTeeth",
    "DoublePlatform.Folktails",
    "DoublePlatform.IronTeeth",
    "TriplePlatform.Folktails",
    "TriplePlatform.IronTeeth",
    "MetalPlatform.Folktails",
    "MetalPlatform.IronTeeth",
    "LargeMetalPlatform.IronTeeth",
  ],

  BRIDGE_ENTITIES: [
    "SuspensionBridge1x1.Folktails",
    "SuspensionBridge1x1.IronTeeth",
    "SuspensionBridge2x1.Folktails",
    "SuspensionBridge2x1.IronTeeth",
    "SuspensionBridge3x1.Folktails",
    "SuspensionBridge3x1.IronTeeth",
    "SuspensionBridge4x1.Folktails",
    "SuspensionBridge4x1.IronTeeth",
    "SuspensionBridge5x1.Folktails",
    "SuspensionBridge5x1.IronTeeth",
    "SuspensionBridge6x1.Folktails",
    "SuspensionBridge6x1.IronTeeth",
  ],

  WOOD_ENTITIES: [
    "WoodWorkshop.Folktails",
    "WoodWorkshop.IronTeeth",
    "TappersShack.Folktails",
    "TappersShack.IronTeeth",
    "PaperMill.Folktails",
    "PaperMill.IronTeeth",
    "PrintingPress.Folktails",
    "PrintingPress.IronTeeth",
    "GearWorkshop.Folktails",
    "GearWorkshop.IronTeeth",
    "Forester.Folktails",
    "Forester.IronTeeth",
    "LumberMill.Folktails",
    "LumberMill.IronTeeth",
  ],

  POWER_ENTITIES: [
    "Windmill.Folktails",
    "LargeWindmill.Folktails",
    "WaterWheel.Folktails",
    "PowerWheel.Folktails",
    "PowerWheel.IronTeeth",
    "Engine.IronTeeth",
    "CompactWaterWheel.IronTeeth",
    "LargeWaterWheel.IronTeeth",
    "PowerShaftStraight.Folktails",
    "PowerShaftStraight.IronTeeth",
    "PowerShaftTShapedIntersection.Folktails",
    "PowerShaftTShapedIntersection.IronTeeth",
    "PowerShaftIntersection.Folktails",
    "PowerShaftIntersection.IronTeeth",
    "PowerShaftHigh.Folktails",
    "PowerShaftHigh.IronTeeth",
    "PowerShaftTurn.Folktails",
    "PowerShaftTurn.IronTeeth",
  ],

  WATER_ENTITIES: [
    "Levee.Folktails",
    "Levee.IronTeeth",
    "Dam.Folktails",
    "Dam.IronTeeth",
    "WaterDump.Folktails",
    "WaterDump.IronTeeth",
    "DeepWaterPump.IronTeeth",
    "Floodgate.Folktails",
    "Floodgate.IronTeeth",
    "DoubleFloodgate.Folktails",
    "DoubleFloodgate.IronTeeth",
    "TripleFloodgate.Folktails",
    "TripleFloodgate.IronTeeth",
    "IrrigationTower.Folktails",
    "MechanicalWaterPump.Folktails",
    "DeepMechanicalWaterPump.IronTeeth",
    "StreamGauge.Folktails",
    "StreamGauge.Ironteeth",
  ],
  LANDSCAPING_ENTITIES: [
    "Dynamite.Folktails",
    "Dynamite.IronTeeth",
    "ExplosivesFactory.Folktails",
    "ExplosivesFactory.IronTeeth",
  ],
  FOOD_ENTITIES: [
    "Bakery.Folktails",
    "Bakery.IronTeeth",
    "Grill.Folktails",
    "Grill.IronTeeth",
    "FarmHouse.Folktails",
    "FarmHouse.IronTeeth",
    "GathererFlag.Folktails",
    "GathererFlag.IronTeeth",
    "Beehive.Folktails",
    "Gristmill.Folktails",
    "Gristmill.IronTeeth",
    "AquaticFarmhouse.Folktails",
    "AquaticFarmhouse.IronTeeth",
  ],
  METAL_ENTITIES: [
    "ScavengerFlag.Folktails",
    "ScavengerFlag.IronTeeth",
    "Smelter.Folktails",
    "Smelter.IronTeeth",
    "Mine.Folktails",
    "Mine.IronTeeth",
  ],
  HOUSING_ENTITIES: [
    "Lodge.Folktails",
    "FlippedLodge.Folktails",
    "DoubleLodge.Folktails",
    "TripleLodge.Folktails",
    "MiniLodge.Folktails",
    "Barrack.IronTeeth",
    "LargeBarrack.IronTeeth",
    "LargeRowhouse.IronTeeth",
    "Rowhouse.IronTeeth",
  ],
  SCIENTE_ENTITIES: [
    "Inventor.Folktails",
    "Inventor.IronTeeth",
    "Observatory.Folktails",
    "Observatory.IronTeeth",
  ],
  LEISURE_ENTITIES: [
    "MudBath.Folktails",
    "MudBath.IronTeeth",
    "Campfire.Folktails",
    "Campfire.IronTeeth",
    "RooftopTerrace.Folktails",
    "RooftopTerrace.IronTeeth",
    "Shrine.Folktails",
    "Shrine.IronTeeth",
    "Lido.Folktails",
    "Lido.IronTeeth",
    "Temple.Folktails",
    "Temple.IronTeeth",
    "Carousel.Folktails",
    "Carousel.IronTeeth",
  ],
  DECORATION_ENTITIES: [
    "Bell.IronTeeth",
    "MetalFence.Folktails",
    "MetalFence.IronTeeth",
    "PlankFence.Folktails",
    "PlankFence.IronTeeth",
    "LogFence.Folktails",
    "LogFence.IronTeeth",
    "BeaverStatue.Folktails",
    "BeaverStatue.IronTeeth",
    "Roof1x1.Folktails",
    "Roof1x1.IronTeeth",
    "Roof1x2.Folktails",
    "Roof1x2.IronTeeth",
    "Roof2x2.Folktails",
    "Roof2x2.IronTeeth",
    "Roof2x3.Folktails",
    "Roof2x3.IronTeeth",
    "Roof3x2.Folktails",
    "Roof3x2.IronTeeth",
    "Shrub.Folktails",
    "Shrub.IronTeeth",
    "Bench.Folktails",
    "Bench.IronTeeth",
    "Scarecrow.Folktails",
  ],
  MONUMENT_ENTITIES: [
    "TributeToIngenuity.Folktails",
    "TributeToIngenuity.IronTeeth",
    "FlameOfProgress.Folktails",
    "FlameOfProgress.IronTeeth",
    "LaborerMonument.Folktails",
    "LaborerMonument.IronTeeth",
  ],
  LABOR_ENTITIES: [
    "DistributionPost.Folktails",
    "DistributionPost.IronTeeth",
    "BuildersHut.Folktails",
    "BuildersHut.IronTeeth",
    "HaulingPost.Folktails",
    "HaulingPost.IronTeeth",
  ],

  STORAGE_ENTITIES: StockpileUtil.stockpileTypes.map(({ id }) => id),

  TREE_ENTITIES: ["Maple", "Pine", "Birch"],
  BEAVER_ENTITIES: ["BeaverAdult", "BeaverChild"],
};

export const ALL_ENTITIES = Object.values(entities).flat();

export const buildingCategories = {
  "Paths and Structures": [
    ...entities.PATH_ENTITIES,
    ...entities.PLATFORM_ENTITIES,
    ...entities.BRIDGE_ENTITIES,
  ],
  Power: entities.POWER_ENTITIES,
  Water: entities.WATER_ENTITIES,
  Landscaping: entities.LANDSCAPING_ENTITIES,
  Food: entities.FOOD_ENTITIES,
  Metal: entities.METAL_ENTITIES,
  Housing: entities.HOUSING_ENTITIES,
  Science: entities.SCIENTE_ENTITIES,
  Leisure: entities.LEISURE_ENTITIES,
  Decoration: entities.DECORATION_ENTITIES,
  Monuments: entities.MONUMENT_ENTITIES,
  Labor: entities.LABOR_ENTITIES,
  Storage: entities.STORAGE_ENTITIES,
  Trees: entities.TREE_ENTITIES,
};

const getSpeciesEntities = (species: string) => {
  Object.values(entities)
    .flat()
    .filter((entity) => entity.includes(species));
};
export const IRONTEETH_ENTITIES = getSpeciesEntities("IronTeeth");
export const FOLKTAILS_ENTITIES = getSpeciesEntities("Folktails");

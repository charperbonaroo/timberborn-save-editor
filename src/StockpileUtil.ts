import { DemoSave, UnknownEntity } from "./DemoSave";

interface StockpileGoodsEntry {
  Good: { Id: string };
  Amount: number;
}

const stockpileTypes = [{
  id: "LargeWaterTank.Folktails",
  capacity: 300,
}, {
  id: "SmallWaterTank.Folktails",
  capacity: 30
}, {
  id: "SmallWarehouse.Folktails",
  capacity: 200,
}, {
  id: "SmallWarehouseNew.Folktails",
  capacity: 30,
}, {
  id: "LogPile.Folktails",
  capacity: 180,
}, {
  id: "UndergroundWarehouse.Folktails",
  capacity: 4000,
}, {
  id: "LargeWarehouse.Folktails",
  capacity: 1000,
}, {
  id: "SmallWarehouse.IronTeeth",
  capacity: 200,
}, {
  id: "SmallWarehouseNew.IronTeeth",
  capacity: 30,
}, {
  id: "SmallWaterTank.IronTeeth",
  capacity: 30,
}, {
  id: "LargeWaterTank.IronTeeth",
  capacity: 300,
}, {
  id: "IndustrialLogPile.IronTeeth",
  capacity: 180,
}, {
  id: "LargeWarehouse.IronTeeth",
  capacity: 1000,
}, {
  id: "MediumWarehouse.Folktails",
  capacity: 200
}, {
  id: "MediumWarehouse.IronTeeth",
  capacity: 200
}];

const stockpileIds = stockpileTypes.map(_ => _.id)

export const StockpileUtil = {
  stockpileTypes,
  stockpileIds,
  getCapacity: (stockpile: UnknownEntity) => stockpileTypes.find(_ => _.id === stockpile.Template)?.capacity,
  getStockpiles: (saveData: DemoSave) => saveData.Entities.filter(_ => _.Components["Inventory:Stockpile"]),
  countGoods: (stockpile: UnknownEntity, accumulator = {} as Record<string, number>) => (((stockpile.Components["Inventory:Stockpile"] as any)?.Storage?.Goods || []) as StockpileGoodsEntry[])
    .reduce((acc, { Good, Amount }) => ({ ...acc, [Good.Id]: Amount + (acc[Good.Id] || 0) }), accumulator)
}

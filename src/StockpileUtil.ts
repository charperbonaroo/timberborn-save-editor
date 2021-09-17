import { DemoSave, UnknownEntity } from "./DemoSave";

interface StockpileGoodsEntry {
  Good: { Id: string };
  Amount: number;
}

const stockpileTypes = [{
  id: "LargeWaterTank.Folktails",
  capacity: 300
}, {
  id: "SmallWaterTank.Folktails",
  capacity: 30
}, {
  id: "SmallWarehouse.Folktails",
  capacity: 200,
}, {
  id: "LogPile.Folktails",
  capacity: 180,
}];

const stockpileIds = stockpileTypes.map(_ => _.id)

export const StockpileUtil = {
  stockpileTypes,
  getCapacity: (stockpile: UnknownEntity) => stockpileTypes.find(_ => _.id === stockpile.Template)?.capacity,
  getStockpiles: (saveData: DemoSave) => saveData.Entities.filter(_ => stockpileIds.includes(_.Template)),
  countGoods: (stockpile: UnknownEntity, accumulator = {} as Record<string, number>) => (((stockpile.Components["Inventory:Stockpile"] as any)?.Storage?.Goods || []) as StockpileGoodsEntry[])
    .reduce((acc, { Good, Amount }) => ({ ...acc, [Good.Id]: Amount + (acc[Good.Id] || 0) }), accumulator)
}

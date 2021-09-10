import { DemoSave, UnknownEntity } from "./DemoSave";

interface StockpileGoodsEntry {
  Good: { Id: string };
  Amount: number;
}

const stockpileTypes = [{
  id: "SmallWaterTank",
  capacity: 30
}, {
  id: "SmallWarehouse",
  capacity: 200,
}, {
  id: "LogPile",
  capacity: 180,
}];

const stockpileIds = stockpileTypes.map(_ => _.id)

export const StockpileUtil = {
  stockpileTypes,
  getCapacity: (stockpile: UnknownEntity) => stockpileTypes.find(_ => _.id === stockpile.TemplateName)?.capacity,
  getStockpiles: (saveData: DemoSave) => saveData.Entities.filter(_ => stockpileIds.includes(_.TemplateName)),
  countGoods: (stockpile: UnknownEntity, accumulator = {} as Record<string, number>) => ((stockpile.Components["Inventory:Stockpile"] as any).Storage.Goods as StockpileGoodsEntry[])
    .reduce((acc, { Good, Amount }) => ({ ...acc, [Good.Id]: Amount + (acc[Good.Id] || 0) }), accumulator)
}

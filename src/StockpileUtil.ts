import { DemoSave, UnknownEntity } from "./DemoSave";

interface StockpileGoodsEntry {
  Good: { Id: string };
  Amount: number;
}

export const StockpileUtil = {
  getStockpiles: (saveData: DemoSave) => saveData.Entities.filter(_ => ["SmallWaterTank", "SmallWarehouse", "LogPile"].includes(_.TemplateName)),
  countGoods: (stockpile: UnknownEntity, accumulator = {} as Record<string, number>) => ((stockpile.Components["Inventory:Stockpile"] as any).Storage.Goods as StockpileGoodsEntry[])
    .reduce((acc, { Good, Amount }) => ({ ...acc, [Good.Id]: Amount + (acc[Good.Id] || 0) }), accumulator)
}

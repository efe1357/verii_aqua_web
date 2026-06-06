import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { goodsReceiptLinesConfig } from '@/features/goods-receipts/config/page-configs';

export function GoodsReceiptLinesPage(): ReactElement {
  return <AquaCrudPage config={goodsReceiptLinesConfig} />;
}

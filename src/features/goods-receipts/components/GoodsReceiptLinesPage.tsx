import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { goodsReceiptLinesConfig } from '@/features/aqua-operations/config/page-configs';

export function GoodsReceiptLinesPage(): ReactElement {
  return <AquaCrudPage config={goodsReceiptLinesConfig} />;
}

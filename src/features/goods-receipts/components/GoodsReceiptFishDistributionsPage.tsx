import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { goodsReceiptFishDistributionsConfig } from '@/features/aqua-operations/config/page-configs';

export function GoodsReceiptFishDistributionsPage(): ReactElement {
  return <AquaCrudPage config={goodsReceiptFishDistributionsConfig} />;
}

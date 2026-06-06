import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { stockConvertLinesConfig } from '@/features/stock-converts/config/page-configs';

export function StockConvertLinesPage(): ReactElement {
  return <AquaCrudPage config={stockConvertLinesConfig} />;
}

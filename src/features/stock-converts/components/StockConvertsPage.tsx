import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { stockConvertLinesConfig, stockConvertsConfig } from '@/features/aqua-operations/config/page-configs';

export function StockConvertsPage(): ReactElement {
  return <AquaCrudPage config={{ ...stockConvertLinesConfig, title: stockConvertsConfig.title, description: stockConvertsConfig.description }} />;
}

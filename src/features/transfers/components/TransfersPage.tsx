import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { transferLinesConfig, transfersConfig } from '@/features/aqua-operations/config/page-configs';

export function TransfersPage(): ReactElement {
  return <AquaCrudPage config={{ ...transferLinesConfig, title: transfersConfig.title, description: transfersConfig.description }} />;
}

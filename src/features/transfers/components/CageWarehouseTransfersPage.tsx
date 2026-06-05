import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cageWarehouseTransferLinesConfig, cageWarehouseTransfersConfig } from '@/features/aqua-operations/config/page-configs';

export function CageWarehouseTransfersPage(): ReactElement {
  return <AquaCrudPage config={{ ...cageWarehouseTransferLinesConfig, title: cageWarehouseTransfersConfig.title, description: cageWarehouseTransfersConfig.description }} />;
}

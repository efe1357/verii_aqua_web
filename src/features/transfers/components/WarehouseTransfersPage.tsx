import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { warehouseTransferLinesConfig, warehouseTransfersConfig } from '@/features/aqua-operations/config/page-configs';

export function WarehouseTransfersPage(): ReactElement {
  return <AquaCrudPage config={{ ...warehouseTransferLinesConfig, title: warehouseTransfersConfig.title, description: warehouseTransfersConfig.description }} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { warehouseCageTransferLinesConfig, warehouseCageTransfersConfig } from '@/features/transfers/config/page-configs';

export function WarehouseCageTransfersPage(): ReactElement {
  return <AquaCrudPage config={{ ...warehouseCageTransferLinesConfig, title: warehouseCageTransfersConfig.title, description: warehouseCageTransfersConfig.description }} />;
}

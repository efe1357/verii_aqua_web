import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { warehouseTransferLinesConfig } from '@/features/aqua-operations/config/page-configs';

export function WarehouseTransferLinesPage(): ReactElement {
  return <AquaCrudPage config={warehouseTransferLinesConfig} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { warehouseCageTransferLinesConfig } from '@/features/transfers/config/page-configs';

export function WarehouseCageTransferLinesPage(): ReactElement {
  return <AquaCrudPage config={warehouseCageTransferLinesConfig} />;
}

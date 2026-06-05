import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cageWarehouseTransferLinesConfig } from '@/features/aqua-operations/config/page-configs';

export function CageWarehouseTransferLinesPage(): ReactElement {
  return <AquaCrudPage config={cageWarehouseTransferLinesConfig} />;
}

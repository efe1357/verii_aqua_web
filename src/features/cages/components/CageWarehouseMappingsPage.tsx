import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cageWarehouseMappingsConfig } from '@/features/cages/config/page-configs';

export function CageWarehouseMappingsPage(): ReactElement {
  return <AquaCrudPage config={cageWarehouseMappingsConfig} />;
}

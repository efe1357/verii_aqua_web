import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua/shared/components/AquaCrudPage';
import { cageWarehouseMappingsConfig } from '../config/page-configs';

export function CageWarehouseMappingsPage(): ReactElement {
  return <AquaCrudPage config={cageWarehouseMappingsConfig} />;
}

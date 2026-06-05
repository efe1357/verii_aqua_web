import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cageBalancesConfig } from '@/features/aqua-reports/config/page-configs';

export function CageBalancesPage(): ReactElement {
  return <AquaCrudPage config={cageBalancesConfig} />;
}

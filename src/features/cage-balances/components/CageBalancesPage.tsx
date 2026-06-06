import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cageBalancesConfig } from '@/features/cage-balances/config/page-configs';

export function CageBalancesPage(): ReactElement {
  return <AquaCrudPage config={cageBalancesConfig} />;
}

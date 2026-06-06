import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { batchMovementsConfig } from '@/features/batch-movements/config/page-configs';

export function BatchMovementsPage(): ReactElement {
  return <AquaCrudPage config={batchMovementsConfig} />;
}

import type { ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { currentDirectionsConfig } from '@/features/current-direction/config/page-configs';

export function CurrentDirectionsPage(): ReactElement {
  return <AquaCrudPage config={currentDirectionsConfig} />;
}

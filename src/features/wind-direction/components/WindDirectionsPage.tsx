import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { windDirectionsConfig } from '@/features/wind-direction/config/page-configs';

export function WindDirectionsPage(): ReactElement {
  return <AquaCrudPage config={windDirectionsConfig} />;
}

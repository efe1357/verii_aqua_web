import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua/shared/components/AquaCrudPage';
import { windDirectionsConfig } from '../config/page-configs';

export function WindDirectionsPage(): ReactElement {
  return <AquaCrudPage config={windDirectionsConfig} />;
}

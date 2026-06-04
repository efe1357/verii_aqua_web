import type { ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua/shared/components/AquaCrudPage';
import { currentDirectionsConfig } from '../config/page-configs';

export function CurrentDirectionsPage(): ReactElement {
  return <AquaCrudPage config={currentDirectionsConfig} />;
}

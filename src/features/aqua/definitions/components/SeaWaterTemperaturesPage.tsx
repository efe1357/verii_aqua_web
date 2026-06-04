import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua/shared/components/AquaCrudPage';
import { seaWaterTemperaturesConfig } from '../config/page-configs';

export function SeaWaterTemperaturesPage(): ReactElement {
  return <AquaCrudPage config={seaWaterTemperaturesConfig} />;
}

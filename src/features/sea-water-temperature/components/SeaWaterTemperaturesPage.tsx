import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { seaWaterTemperaturesConfig } from '@/features/aqua-definitions/config/page-configs';

export function SeaWaterTemperaturesPage(): ReactElement {
  return <AquaCrudPage config={seaWaterTemperaturesConfig} />;
}

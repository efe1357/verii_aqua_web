import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { weatherSeveritiesConfig } from '@/features/aqua-definitions/config/page-configs';

export function WeatherSeveritiesPage(): ReactElement {
  return <AquaCrudPage config={weatherSeveritiesConfig} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { weatherTypesConfig } from '@/features/aqua-definitions/config/page-configs';

export function WeatherTypesPage(): ReactElement {
  return <AquaCrudPage config={weatherTypesConfig} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { dailyWeathersConfig } from '@/features/daily-weathers/config/page-configs';

export function DailyWeathersPage(): ReactElement {
  return <AquaCrudPage config={dailyWeathersConfig} />;
}

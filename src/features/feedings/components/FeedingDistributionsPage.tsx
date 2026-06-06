import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { feedingDistributionsConfig } from '@/features/feedings/config/page-configs';

export function FeedingDistributionsPage(): ReactElement {
  return <AquaCrudPage config={feedingDistributionsConfig} />;
}

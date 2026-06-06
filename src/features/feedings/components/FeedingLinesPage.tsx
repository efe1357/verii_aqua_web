import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { feedingLinesConfig } from '@/features/feedings/config/page-configs';

export function FeedingLinesPage(): ReactElement {
  return <AquaCrudPage config={feedingLinesConfig} />;
}

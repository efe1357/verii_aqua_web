import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { weighingLinesConfig } from '@/features/weighings/config/page-configs';

export function WeighingLinesPage(): ReactElement {
  return <AquaCrudPage config={weighingLinesConfig} />;
}

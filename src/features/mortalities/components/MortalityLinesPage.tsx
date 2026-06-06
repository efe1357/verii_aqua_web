import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { mortalityLinesConfig } from '@/features/mortalities/config/page-configs';

export function MortalityLinesPage(): ReactElement {
  return <AquaCrudPage config={mortalityLinesConfig} />;
}

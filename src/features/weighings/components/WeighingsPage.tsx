import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { weighingLinesConfig, weighingsConfig } from '@/features/aqua-operations/config/page-configs';

export function WeighingsPage(): ReactElement {
  return <AquaCrudPage config={{ ...weighingLinesConfig, title: weighingsConfig.title, description: weighingsConfig.description }} />;
}

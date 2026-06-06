import type { ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { fishBatchesConfig } from '@/features/fish-batches/config/page-configs';

export function FishBatchesPage(): ReactElement {
  return <AquaCrudPage config={fishBatchesConfig} />;
}

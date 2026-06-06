import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { cagesConfig } from '@/features/cages/config/page-configs';

export function CagesPage(): ReactElement {
  return <AquaCrudPage config={cagesConfig} />;
}

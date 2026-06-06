import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { netOperationLinesConfig } from '@/features/net-operations/config/page-configs';

export function NetOperationLinesPage(): ReactElement {
  return <AquaCrudPage config={netOperationLinesConfig} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { transferLinesConfig } from '@/features/aqua-operations/config/page-configs';

export function TransferLinesPage(): ReactElement {
  return <AquaCrudPage config={transferLinesConfig} />;
}

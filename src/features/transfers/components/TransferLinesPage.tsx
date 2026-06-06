import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { transferLinesConfig } from '@/features/transfers/config/page-configs';

export function TransferLinesPage(): ReactElement {
  return <AquaCrudPage config={transferLinesConfig} />;
}

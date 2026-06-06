import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { netOperationTypesConfig } from '@/features/net-operations/config/page-configs';

export function NetOperationTypesPage(): ReactElement {
  return <AquaCrudPage config={netOperationTypesConfig} />;
}

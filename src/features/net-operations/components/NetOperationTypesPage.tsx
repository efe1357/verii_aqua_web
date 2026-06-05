import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { netOperationTypesConfig } from '@/features/aqua-definitions/config/page-configs';

export function NetOperationTypesPage(): ReactElement {
  return <AquaCrudPage config={netOperationTypesConfig} />;
}

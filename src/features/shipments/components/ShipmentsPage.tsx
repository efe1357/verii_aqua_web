import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { shipmentLinesConfig, shipmentsConfig } from '@/features/aqua-operations/config/page-configs';

export function ShipmentsPage(): ReactElement {
  return <AquaCrudPage config={{ ...shipmentLinesConfig, title: shipmentsConfig.title, description: shipmentsConfig.description }} />;
}

import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { shipmentLinesConfig } from '@/features/shipments/config/page-configs';

export function ShipmentLinesPage(): ReactElement {
  return <AquaCrudPage config={shipmentLinesConfig} />;
}

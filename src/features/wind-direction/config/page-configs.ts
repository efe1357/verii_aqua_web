import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const windDirectionsConfig: AquaCrudConfig = {
  key: 'windDirections',
  title: 'aqua.pages.windDirections.title',
  description: 'aqua.pages.windDirections.description',
  endpoint: '/api/WindDirection',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'name', label: 'aqua.fields.windDirectionName', type: 'text', required: true },
  ],
  columns: [
    { key: 'name', label: 'aqua.fields.windDirectionName' },
  ],
};

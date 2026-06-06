import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const currentDirectionsConfig: AquaCrudConfig = {
  key: 'currentDirections',
  title: 'aqua.pages.currentDirections.title',
  description: 'aqua.pages.currentDirections.description',
  endpoint: '/api/CurrentDirection',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'name', label: 'aqua.fields.currentDirectionName', type: 'text', required: true },
  ],
  columns: [
    { key: 'name', label: 'aqua.fields.currentDirectionName' },
  ],
};

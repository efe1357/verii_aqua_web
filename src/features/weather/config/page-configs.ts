import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const weatherSeveritiesConfig: AquaCrudConfig = {
  key: 'weatherSeverities',
  title: 'aqua.pages.weatherSeverities.title',
  description: 'aqua.pages.weatherSeverities.description',
  endpoint: 'WeatherSeverity',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'code', label: 'aqua.fields.code', type: 'text', required: true },
    { key: 'name', label: 'aqua.fields.name', type: 'text', required: true },
    { key: 'score', label: 'aqua.fields.score', type: 'number', required: true },
  ],
  columns: [
    { key: 'code', label: 'aqua.fields.code' },
    { key: 'name', label: 'aqua.fields.name' },
    { key: 'score', label: 'aqua.fields.score' },
  ],
};

export const weatherTypesConfig: AquaCrudConfig = {
  key: 'weatherTypes',
  title: 'aqua.pages.weatherTypes.title',
  description: 'aqua.pages.weatherTypes.description',
  endpoint: 'WeatherType',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'code', label: 'aqua.fields.code', type: 'text', required: true },
    { key: 'name', label: 'aqua.fields.name', type: 'text', required: true },
  ],
  columns: [
    { key: 'code', label: 'aqua.fields.code' },
    { key: 'name', label: 'aqua.fields.name' },
  ],
};

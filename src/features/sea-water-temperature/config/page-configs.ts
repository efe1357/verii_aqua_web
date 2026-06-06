import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const seaWaterTemperaturesConfig: AquaCrudConfig = {
  key: 'seaWaterTemperatures',
  title: 'aqua.pages.seaWaterTemperatures.title',
  description: 'aqua.pages.seaWaterTemperatures.description',
  endpoint: '/api/SeaWaterTemperature',
  listStaleTimeMs: 30000,
  fields: [
    {
      key: 'projectId',
      label: 'aqua.fields.projectId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Project',
        labelKeys: ['projectCode', 'projectName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    {
      key: 'projectCageId',
      label: 'aqua.fields.projectCageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'ProjectCage',
        labelKeys: ['cageCode', 'cageName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 45000,
        dependsOnFieldKey: 'projectId',
        filterColumn: 'ProjectId',
      },
    },
    { key: 'recordDate', label: 'aqua.fields.recordDate', type: 'date', required: true },
    { key: 'waterTemperatureCelsius', label: 'aqua.fields.waterTemperatureCelsius', type: 'number', numberStep: '0.1' },
    { key: 'weatherDescription', label: 'aqua.fields.weatherDescription', type: 'text', required: true },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'recordDate', label: 'aqua.fields.recordDate' },
    { key: 'waterTemperatureCelsius', label: 'aqua.fields.waterTemperatureCelsius' },
    { key: 'weatherDescription', label: 'aqua.fields.weatherDescription' },
    { key: 'note', label: 'aqua.fields.note' },
  ],
};

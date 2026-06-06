import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const projectsConfig: AquaCrudConfig = {
  key: 'projects',
  title: 'aqua.pages.projects.title',
  description: 'aqua.pages.projects.description',
  endpoint: 'Project',
  listStaleTimeMs: 60000,
  fields: [
    { key: 'projectCode', label: 'aqua.fields.projectCode', type: 'text', required: true },
    { key: 'projectName', label: 'aqua.fields.projectName', type: 'text', required: true },
    { key: 'startDate', label: 'aqua.fields.startDate', type: 'date', required: true },
    { key: 'endDate', label: 'aqua.fields.endDate', type: 'date' },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'startDate', label: 'aqua.fields.startDate' },
  ],
  defaultValues: { status: 0 },
};

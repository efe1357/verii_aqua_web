import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const projectCageAssignmentsConfig: AquaCrudConfig = {
  key: 'projectCageAssignments',
  title: 'aqua.pages.projectCageAssignments.title',
  description: 'aqua.pages.projectCageAssignments.description',
  endpoint: 'ProjectCage',
  listStaleTimeMs: 45000,
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
      key: 'cageId',
      label: 'aqua.fields.cageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Cage',
        labelKeys: ['cageCode', 'cageName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    { key: 'assignedDate', label: 'aqua.fields.assignedDate', type: 'date', required: true },
    { key: 'releasedDate', label: 'aqua.fields.releasedDate', type: 'date' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'assignedDate', label: 'aqua.fields.assignedDate' },
    { key: 'releasedDate', label: 'aqua.fields.releasedDate' },
  ],
  defaultValues: { releasedDate: null },
};

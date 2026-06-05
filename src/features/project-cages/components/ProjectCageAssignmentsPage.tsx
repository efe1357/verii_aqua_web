import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { projectCageAssignmentsConfig } from '@/features/aqua-definitions/config/page-configs';

export function ProjectCageAssignmentsPage(): ReactElement {
  return <AquaCrudPage config={projectCageAssignmentsConfig} />;
}

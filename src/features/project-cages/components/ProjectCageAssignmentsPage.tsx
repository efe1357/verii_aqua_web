import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { projectCageAssignmentsConfig } from '@/features/project-cages/config/page-configs';

export function ProjectCageAssignmentsPage(): ReactElement {
  return <AquaCrudPage config={projectCageAssignmentsConfig} />;
}

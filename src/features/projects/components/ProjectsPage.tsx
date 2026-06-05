import { type ReactElement } from 'react';
import { AquaCrudPage } from '@/features/aqua-core/components/AquaCrudPage';
import { projectsConfig } from '@/features/aqua-definitions/config/page-configs';

export function ProjectsPage(): ReactElement {
  return <AquaCrudPage config={projectsConfig} />;
}

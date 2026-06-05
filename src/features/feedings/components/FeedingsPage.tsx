import { type ReactElement } from 'react';
import { AquaHeaderLineCrudPage } from '@/features/aqua-core/components/AquaHeaderLineCrudPage';
import { feedingDistributionsConfig, feedingLinesConfig, feedingsConfig } from '@/features/aqua-operations/config/page-configs';

export function FeedingsPage(): ReactElement {
  return (
    <AquaHeaderLineCrudPage
      headerConfig={feedingsConfig}
      lineConfig={feedingLinesConfig}
      lineForeignKey="feedingId"
      lineSectionTitle="aqua.pages.feedingLines.title"
      lineSectionDescription="aqua.common.linesForRecord"
      detailConfig={feedingDistributionsConfig}
      detailForeignKey="feedingLineId"
      detailSectionTitle="aqua.pages.feedingDistributions.title"
      detailSectionDescription="aqua.common.distributionsForLine"
    />
  );
}

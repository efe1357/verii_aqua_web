import { type ReactElement } from 'react';
import { AquaHeaderLineCrudPage } from './AquaHeaderLineCrudPage';
import { feedingDistributionsConfig, feedingLinesConfig, feedingsConfig } from '../config/page-configs';

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

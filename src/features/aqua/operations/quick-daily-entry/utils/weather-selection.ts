import type { WeatherSeverityDto, WeatherTypeDto } from '../types/quick-daily-entry-types';

function getRankedSeverities(severities: WeatherSeverityDto[]): WeatherSeverityDto[] {
  return [...severities].sort((left, right) => {
    const leftScore = Number(left.score ?? 0);
    const rightScore = Number(right.score ?? 0);

    if (leftScore !== rightScore) return leftScore - rightScore;

    return String(left.name ?? left.code ?? left.id).localeCompare(
      String(right.name ?? right.code ?? right.id),
      'tr'
    );
  });
}

export function getFilteredWeatherSeverities(
  _weatherTypeId: number,
  _weatherTypes: WeatherTypeDto[],
  severities: WeatherSeverityDto[]
): WeatherSeverityDto[] {
  return getRankedSeverities(severities);
}

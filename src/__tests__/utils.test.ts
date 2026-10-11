import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import type { HassEntity } from 'home-assistant-js-websocket';
import {
  getStateObj,
  isUnavailable,
  parseNumeric,
  formatNumber,
  formatValue,
  statusText,
  barPercent,
  formatRelativeTime,
  resolveMetricTile,
  resolvePrimaryTile,
  headerStatusText,
  newestUpdate,
} from '../utils';
import {
  METRIC_DEFAULTS,
  METRIC_KEYS,
  FALLBACK_TILE_ICON,
  normalizeMetricConfig,
} from '../const';
import type { MetricEntityConfig, ScaleCardConfig } from '../types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeHass(entities: Record<string, Partial<HassEntity>>): HomeAssistant {
  return {
    states: entities as unknown as HomeAssistant['states'],
    callService: () => Promise.resolve(),
    callWS: () => Promise.resolve(),
    config: {} as HomeAssistant['config'],
    user: {} as HomeAssistant['user'],
    auth: {} as HomeAssistant['auth'],
    connection: {} as HomeAssistant['connection'],
    themes: {} as HomeAssistant['themes'],
    selectedTheme: null,
    panels: {} as HomeAssistant['panels'],
    panelUrl: '',
    language: 'en',
    localTimezone: 'UTC',
    translationMetadata: {} as HomeAssistant['translationMetadata'],
    // Anything else falls through as undefined; we only exercise fields used.
  } as unknown as HomeAssistant;
}

const sensor = (
  state: string,
  attributes: Record<string, unknown> = {},
  lastUpdated = '',
): HassEntity =>
  ({
    entity_id: 'sensor.test',
    state,
    attributes,
    last_changed: lastUpdated,
    last_updated: lastUpdated,
    context: { id: 'x', parent_id: null, user_id: null },
  } as unknown as HassEntity);

// ---------------------------------------------------------------------------
// parseNumeric
// ---------------------------------------------------------------------------

describe('parseNumeric', () => {
  it('parses integers', () => expect(parseNumeric('9')).toBe(9));
  it('parses decimals', () => expect(parseNumeric('79.13')).toBe(79.13));
  it('parses negatives', () => expect(parseNumeric('-3.5')).toBe(-3.5));
  it('null for non-numeric', () => expect(parseNumeric('unknown')).toBeNull());
  it('null for empty string', () => expect(parseNumeric('')).toBeNull());
  it('null for undefined', () => expect(parseNumeric(undefined)).toBeNull());
  it('null for NaN', () => expect(parseNumeric('NaN')).toBeNull());
});

// ---------------------------------------------------------------------------
// formatNumber
// ---------------------------------------------------------------------------

describe('formatNumber', () => {
  it('groups thousands (1732 → "1,732")', () => {
    expect(formatNumber(1732, 0)).toBe('1,732');
  });

  it('does not group a four-digit number below 1000', () => {
    expect(formatNumber(531, 0)).toBe('531');
  });

  it('groups millions', () => {
    expect(formatNumber(1234567, 0)).toBe('1,234,567');
  });

  it('keeps meaningful decimals (26.74)', () => {
    expect(formatNumber(26.74, 2)).toBe('26.74');
  });

  it('trims trailing zeros (20.30 → "20.3")', () => {
    expect(formatNumber(20.3, 2)).toBe('20.3');
    expect(formatNumber(20.3, 1)).toBe('20.3');
  });

  it('trims all-zero decimals (26.00 → "26")', () => {
    expect(formatNumber(26, 2)).toBe('26');
  });

  it('keeps negative sign', () => {
    expect(formatNumber(-1234.5, 1)).toBe('-1,234.5');
  });

  it('clamps negative decimals to 0', () => {
    expect(formatNumber(79.136, -1)).toBe('79');
  });
});

// ---------------------------------------------------------------------------
// formatValue (unit spacing)
// ---------------------------------------------------------------------------

describe('formatValue', () => {
  it('percent hugs the number', () => {
    expect(formatValue(20.3, '%', 1)).toBe('20.3%');
  });

  it('other units get a space', () => {
    expect(formatValue(79.13, 'kg', 2)).toBe('79.13 kg');
    expect(formatValue(1732, 'cal', 0)).toBe('1,732 cal');
    expect(formatValue(531, 'Ω', 0)).toBe('531 Ω');
  });

  it('no unit means the bare number', () => {
    expect(formatValue(26.74, '', 2)).toBe('26.74');
    expect(formatValue(9, '', 0)).toBe('9');
  });
});

// ---------------------------------------------------------------------------
// getStateObj
// ---------------------------------------------------------------------------

describe('getStateObj', () => {
  it('returns null when hass is undefined', () => {
    expect(getStateObj(undefined, 'sensor.a')).toBeNull();
  });

  it('returns null when entity id is empty', () => {
    expect(getStateObj(makeHass({}), '')).toBeNull();
  });

  it('returns null for an unknown entity id', () => {
    expect(getStateObj(makeHass({}), 'sensor.missing')).toBeNull();
  });

  it('returns the state object for a known entity', () => {
    const s = sensor('79.13');
    const hass = makeHass({ 'sensor.a': s });
    expect(getStateObj(hass, 'sensor.a')).toBe(s);
  });
});

// ---------------------------------------------------------------------------
// isUnavailable / statusText
// ---------------------------------------------------------------------------

describe('isUnavailable', () => {
  it('true for null', () => expect(isUnavailable(null)).toBe(true));
  it('true for undefined', () => expect(isUnavailable(undefined)).toBe(true));
  it('true for unavailable state', () =>
    expect(isUnavailable(sensor('unavailable'))).toBe(true));
  it('true for unknown state', () =>
    expect(isUnavailable(sensor('unknown'))).toBe(true));
  it('false for a numeric state', () => expect(isUnavailable(sensor('79.13'))).toBe(false));
});

describe('statusText', () => {
  it('"Unavailable" for null', () => expect(statusText(null)).toBe('Unavailable'));
  it('"Unavailable" for unavailable', () => expect(statusText(sensor('unavailable'))).toBe('Unavailable'));
  it('"Unknown" for unknown', () => expect(statusText(sensor('unknown'))).toBe('Unknown'));
  it('numeric state as string', () => expect(statusText(sensor('9'))).toBe('9'));
  it('capitalises non-standard states', () => expect(statusText(sensor('measuring'))).toBe('Measuring'));
});

// ---------------------------------------------------------------------------
// barPercent
// ---------------------------------------------------------------------------

describe('barPercent', () => {
  it('null for non-percentage units', () => {
    expect(barPercent(sensor('79.13'), 'kg')).toBeNull();
    expect(barPercent(sensor('1732'), 'cal')).toBeNull();
    expect(barPercent(sensor('26.74'), '')).toBeNull();
  });

  it('returns the value for percentages', () => {
    expect(barPercent(sensor('20.3'), '%')).toBe(20.3);
    expect(barPercent(sensor('57.5'), '%')).toBe(57.5);
  });

  it('clamps out-of-range percentages', () => {
    expect(barPercent(sensor('140'), '%')).toBe(100);
    expect(barPercent(sensor('-5'), '%')).toBe(0);
  });

  it('null when unavailable', () => {
    expect(barPercent(sensor('unavailable'), '%')).toBeNull();
    expect(barPercent(null, '%')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

describe('formatRelativeTime', () => {
  it('empty for undefined', () => expect(formatRelativeTime(undefined)).toBe(''));
  it('empty for unparseable', () => expect(formatRelativeTime('not-a-date')).toBe(''));
  it('"just now" under a minute', () =>
    expect(formatRelativeTime(new Date(Date.now() - 30 * 1000).toISOString())).toBe('just now'));
  it('minutes under an hour', () =>
    expect(formatRelativeTime(new Date(Date.now() - 12 * 60000).toISOString())).toBe('12 min ago'));
  it('hours under a day', () =>
    expect(formatRelativeTime(new Date(Date.now() - 3 * 3600000).toISOString())).toBe('3 hr ago'));
  it('days under a week', () =>
    expect(formatRelativeTime(new Date(Date.now() - 2 * 86400000).toISOString())).toBe('2 d ago'));
  it('date for a week or older', () => {
    const r = formatRelativeTime(new Date(Date.now() - 20 * 86400000).toISOString());
    expect(r).toMatch(/\d/);
    expect(r).not.toMatch(/ago$/);
  });
});

// ---------------------------------------------------------------------------
// normalizeMetricConfig
// ---------------------------------------------------------------------------

describe('normalizeMetricConfig', () => {
  it('accepts a bare string', () => {
    expect(normalizeMetricConfig('sensor.weight')).toEqual({
      entity: 'sensor.weight',
      columns: 1,
    });
  });

  it('preserves every override', () => {
    const c = normalizeMetricConfig({
      entity: 'sensor.body_fat',
      metric: 'body_fat',
      name: 'Fat %',
      icon: 'mdi:chart-donut',
      unit: '%',
      decimals: 1,
      columns: 2,
    });
    expect(c).toEqual({
      entity: 'sensor.body_fat',
      columns: 2,
      metric: 'body_fat',
      name: 'Fat %',
      icon: 'mdi:chart-donut',
      unit: '%',
      decimals: 1,
    });
  });

  it('drops unknown metric keys and empty strings', () => {
    const c = normalizeMetricConfig({
      entity: 'sensor.x',
      metric: 'not_a_metric',
      name: '   ',
      icon: '',
    });
    expect(c.metric).toBeUndefined();
    expect(c.name).toBeUndefined();
    expect(c.icon).toBeUndefined();
  });

  it('clamps decimals to 0-6', () => {
    expect(normalizeMetricConfig({ entity: 'sensor.x', decimals: 9 }).decimals).toBe(6);
    expect(normalizeMetricConfig({ entity: 'sensor.x', decimals: -2 }).decimals).toBe(0);
  });

  it('defaults columns to 1 and rejects non-1/2 values', () => {
    expect(normalizeMetricConfig({ entity: 'sensor.x', columns: 3 }).columns).toBe(1);
    expect(normalizeMetricConfig({ entity: 'sensor.x', columns: 2 }).columns).toBe(2);
  });

  it('returns an empty entity for junk input', () => {
    expect(normalizeMetricConfig(null)).toEqual({ entity: '', columns: 1 });
  });
});

// ---------------------------------------------------------------------------
// resolveMetricTile
// ---------------------------------------------------------------------------

describe('resolveMetricTile', () => {
  const hass = makeHass({
    'sensor.weight': sensor('79.13', { friendly_name: 'Fitness Scale', unit_of_measurement: 'kg' }),
    'sensor.body_fat': sensor('20.3'),
    'sensor.bmr': sensor('1732'),
    'sensor.bmi': sensor('26.74'),
    'sensor.impedance': sensor('531'),
    'sensor.metabolic_age': sensor('26'),
    'sensor.visceral_fat': sensor('9'),
    'sensor.missing': sensor('unavailable'),
  });

  it('uses the metric label on full tiles', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.bmr', metric: 'bmr', columns: 1 });
    expect(t.name).toBe('Basal Metabolic Rate');
    expect(t.value).toBe('1,732 cal');
    expect(t.icon).toBe('mdi:fire');
  });

  it('uses the short label on half tiles', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.bmr', metric: 'bmr', columns: 2 });
    expect(t.name).toBe('BMR');
  });

  it('formats decimals and units per metric', () => {
    expect(resolveMetricTile(hass, { entity: 'sensor.body_fat', metric: 'body_fat', columns: 2 }).value).toBe('20.3%');
    expect(resolveMetricTile(hass, { entity: 'sensor.bmi', metric: 'bmi', columns: 2 }).value).toBe('26.74');
    expect(resolveMetricTile(hass, { entity: 'sensor.impedance', metric: 'impedance', columns: 2 }).value).toBe('531 Ω');
    expect(resolveMetricTile(hass, { entity: 'sensor.metabolic_age', metric: 'metabolic_age', columns: 2 }).value).toBe('26');
    expect(resolveMetricTile(hass, { entity: 'sensor.visceral_fat', metric: 'visceral_fat', columns: 2 }).value).toBe('9');
    expect(resolveMetricTile(hass, { entity: 'sensor.weight', metric: 'weight', columns: 1 }).value).toBe('79.13 kg');
  });

  it('honours per-tile unit and decimals overrides', () => {
    const t = resolveMetricTile(hass, {
      entity: 'sensor.weight',
      metric: 'weight',
      columns: 1,
      unit: 'lb',
      decimals: 1,
    });
    expect(t.value).toBe('79.1 lb');
  });

  it('falls back to friendly_name when no metric key', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.weight', columns: 1 });
    expect(t.name).toBe('Fitness Scale');
    expect(t.icon).toBe(FALLBACK_TILE_ICON);
    expect(t.value).toBe('79.13');
  });

  it('custom name and icon win over the metric defaults', () => {
    const t = resolveMetricTile(hass, {
      entity: 'sensor.body_fat',
      metric: 'body_fat',
      columns: 2,
      name: 'Fat %',
      icon: 'mdi:percent',
    });
    expect(t.name).toBe('Fat %');
    expect(t.icon).toBe('mdi:percent');
  });

  it('marks unavailable tiles', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.missing', metric: 'weight', columns: 2 });
    expect(t.isUnavailable).toBe(true);
    expect(t.value).toBe('Unavailable');
    expect(t.barPercent).toBeNull();
  });

  it('handles hass being undefined', () => {
    const t = resolveMetricTile(undefined, { entity: 'sensor.a', columns: 1 });
    expect(t.isUnavailable).toBe(true);
    expect(t.name).toBe('sensor.a');
    expect(t.stateObj).toBeNull();
  });

  it('flags the primary tile', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.weight', metric: 'weight', columns: 1 }, 'sensor.weight');
    expect(t.isPrimary).toBe(true);
    const other = resolveMetricTile(hass, { entity: 'sensor.bmi', metric: 'bmi', columns: 2 }, 'sensor.weight');
    expect(other.isPrimary).toBe(false);
  });

  it('computes bar percent for percentage metrics', () => {
    const t = resolveMetricTile(hass, { entity: 'sensor.body_fat', metric: 'body_fat', columns: 2 });
    expect(t.barPercent).toBe(20.3);
  });
});

// ---------------------------------------------------------------------------
// resolvePrimaryTile / headerStatusText
// ---------------------------------------------------------------------------

const entities: MetricEntityConfig[] = [
  { entity: 'sensor.bmr', metric: 'bmr', columns: 2 },
  { entity: 'sensor.weight', metric: 'weight', columns: 1 },
  { entity: 'sensor.body_fat', metric: 'body_fat', columns: 2 },
];

const baseConfig: ScaleCardConfig = { type: 'custom:scale-card', name: 'Scale', entities };

describe('resolvePrimaryTile', () => {
  it('defaults to the weight metric', () => {
    expect(resolvePrimaryTile(baseConfig)?.entity).toBe('sensor.weight');
  });

  it('resolves a primary metric key', () => {
    expect(resolvePrimaryTile({ ...baseConfig, primary: 'body_fat' })?.entity).toBe('sensor.body_fat');
  });

  it('resolves a primary entity_id', () => {
    expect(resolvePrimaryTile({ ...baseConfig, primary: 'sensor.bmr' })?.entity).toBe('sensor.bmr');
  });

  it('falls back to the weight metric when the primary is unknown', () => {
    expect(resolvePrimaryTile({ ...baseConfig, primary: 'sensor.nope' })?.entity).toBe('sensor.weight');
  });

  it('falls back to the first entity when no weight metric is configured', () => {
    const noWeight: ScaleCardConfig = { ...baseConfig, entities: [entities[0], entities[2]] };
    expect(resolvePrimaryTile(noWeight)?.entity).toBe('sensor.bmr');
  });

  it('null for an empty entity list', () => {
    expect(resolvePrimaryTile({ ...baseConfig, entities: [] })).toBeNull();
  });
});

describe('headerStatusText', () => {
  const hass = makeHass({
    'sensor.weight': sensor('79.13'),
    'sensor.body_fat': sensor('20.3'),
  });

  it('shows the primary value', () => {
    expect(headerStatusText(hass, baseConfig)).toBe('79.13 kg');
  });

  it('follows the configured primary', () => {
    expect(
      headerStatusText(hass, { ...baseConfig, entities: [entities[2]], primary: 'body_fat' }),
    ).toBe('20.3%');
  });

  it('"No metrics" for an empty list', () => {
    expect(headerStatusText(hass, { ...baseConfig, entities: [] })).toBe('No metrics');
  });

  it('"Unavailable" when the primary sensor is down', () => {
    expect(headerStatusText(hass, { ...baseConfig, entities: [entities[0]] })).toBe('Unavailable');
  });
});

// ---------------------------------------------------------------------------
// newestUpdate
// ---------------------------------------------------------------------------

describe('newestUpdate', () => {
  const now = Date.now();
  const newest = new Date(now - 5 * 60000).toISOString();
  const hass = makeHass({
    'sensor.a': sensor('1', {}, newest),
    'sensor.b': sensor('2', {}, new Date(now - 2 * 86400000).toISOString()),
    'sensor.c': sensor('3'),
  });

  it('returns the newest last_updated', () => {
    const iso = newestUpdate(hass, [
      { entity: 'sensor.a', columns: 1 },
      { entity: 'sensor.b', columns: 1 },
      { entity: 'sensor.c', columns: 1 },
    ]);
    expect(iso).toBe(newest);
  });

  it('empty when nothing reports a timestamp', () => {
    expect(newestUpdate(hass, [{ entity: 'sensor.c', columns: 1 }])).toBe('');
  });

  it('empty without hass', () => {
    expect(newestUpdate(undefined, [{ entity: 'sensor.a', columns: 1 }])).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Metric registry
// ---------------------------------------------------------------------------

describe('METRIC_DEFAULTS', () => {
  it('covers every metric key', () => {
    for (const key of METRIC_KEYS) {
      const d = METRIC_DEFAULTS[key];
      expect(d.label.length).toBeGreaterThan(0);
      expect(d.short.length).toBeGreaterThan(0);
      expect(d.icon.startsWith('mdi:')).toBe(true);
    }
  });

  it('matches the example readings from the brief', () => {
    const rows: Record<string, string> = {
      bmr: '1,732 cal',
      body_fat: '20.3%',
      bmi: '26.74',
      body_water: '57.5%',
      bone_mass: '3.15 kg',
      fat_free_weight: '63.07 kg',
      impedance: '531 Ω',
      metabolic_age: '26',
      muscle_mass: '59.92 kg',
      protein: '18.2%',
      skeletal_muscle: '51.5%',
      subcutaneous_fat: '17.6%',
      visceral_fat: '9',
      weight: '79.13 kg',
    };
    const values: Record<string, number> = {
      bmr: 1732,
      body_fat: 20.3,
      bmi: 26.74,
      body_water: 57.5,
      bone_mass: 3.15,
      fat_free_weight: 63.07,
      impedance: 531,
      metabolic_age: 26,
      muscle_mass: 59.92,
      protein: 18.2,
      skeletal_muscle: 51.5,
      subcutaneous_fat: 17.6,
      visceral_fat: 9,
      weight: 79.13,
    };
    for (const key of METRIC_KEYS) {
      const d = METRIC_DEFAULTS[key];
      expect(formatValue(values[key], d.unit, d.decimals)).toBe(rows[key]);
    }
  });
});

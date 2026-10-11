import type { HomeAssistant } from 'custom-card-helpers';
import type { HassEntity } from 'home-assistant-js-websocket';
import { FALLBACK_TILE_ICON, metricDefaults } from './const';
import type {
  MetricEntityConfig,
  ScaleCardConfig,
  MetricTileInfo,
} from './types';

/** Look up a state object from hass by entity_id. */
export function getStateObj(
  hass: HomeAssistant | undefined,
  entityId: string,
): HassEntity | null {
  if (!hass || !entityId) return null;
  return hass.states[entityId] ?? null;
}

/** True when the entity is missing, or its state is unavailable/unknown. */
export function isUnavailable(stateObj: HassEntity | null | undefined): boolean {
  if (!stateObj) return true;
  return stateObj.state === 'unavailable' || stateObj.state === 'unknown';
}

/** Parse a sensor state into a number. Returns null when the state isn't
 *  numeric (scales sometimes report empty or text states). */
export function parseNumeric(state: string | undefined): number | null {
  if (state === undefined || state === null) return null;
  const s = String(state).trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Format a number the way the card displays it:
 *  - thousands separators on the integer part (1732 → "1,732")
 *  - trailing zeros trimmed (20.30 → "20.3", 26.00 → "26")
 *  - negative numbers keep their sign */
export function formatNumber(value: number, decimals: number): string {
  const fixed = value.toFixed(Math.max(0, decimals));
  const negative = fixed.startsWith('-');
  const body = negative ? fixed.slice(1) : fixed;
  const [intPart, fracPart] = body.split('.');
  const trimmedFrac = fracPart ? fracPart.replace(/0+$/, '') : '';
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (negative ? '-' : '') + grouped + (trimmedFrac ? `.${trimmedFrac}` : '');
}

/** Append the display unit. Percentages hug the number ("20.3%"), every
 *  other unit gets a space ("79.13 kg", "1,732 cal"). Empty unit = none. */
export function formatValue(value: number, unit: string, decimals: number): string {
  const num = formatNumber(value, decimals);
  if (!unit) return num;
  return unit === '%' ? `${num}%` : `${num} ${unit}`;
}

/** Status line for a tile: formatted value, or Unavailable / Unknown. */
export function statusText(stateObj: HassEntity | null | undefined): string {
  if (!stateObj) return 'Unavailable';
  if (isUnavailable(stateObj)) {
    return stateObj.state === 'unknown' ? 'Unknown' : 'Unavailable';
  }
  const n = parseNumeric(stateObj.state);
  if (n === null) {
    // Non-numeric state: capitalise what the sensor reports.
    return stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1);
  }
  return String(n);
}

/** 0-100 bar width for percentage metrics; null for everything else. */
export function barPercent(
  stateObj: HassEntity | null | undefined,
  unit: string,
): number | null {
  if (unit !== '%') return null;
  if (!stateObj || isUnavailable(stateObj)) return null;
  const n = parseNumeric(stateObj.state);
  if (n === null) return null;
  return Math.max(0, Math.min(100, n));
}

/** Human-friendly "how old is this reading" line.
 *  Scales report infrequently, so days matter as much as minutes. */
export function formatRelativeTime(iso: string | undefined): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const diffMin = Math.floor((Date.now() - t) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const hrs = Math.floor(diffMin / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} d ago`;
  return new Date(t).toLocaleDateString();
}

/** Resolve the tile that the header represents.
 *  `primary` accepts a metric key ("weight") or an entity_id; falls back to
 *  the weight metric, then the first configured entity. */
export function resolvePrimaryTile(
  config: ScaleCardConfig,
): MetricEntityConfig | null {
  const entities = config.entities;
  if (entities.length === 0) return null;

  const wanted = typeof config.primary === 'string' ? config.primary.trim() : '';
  if (wanted) {
    const byMetric = entities.find((e) => e.metric === wanted);
    if (byMetric) return byMetric;
    const byEntity = entities.find((e) => e.entity === wanted);
    if (byEntity) return byEntity;
  }

  const weight = entities.find((e) => e.metric === 'weight');
  if (weight) return weight;
  return entities[0];
}

/** Resolve a single config entry to render-ready info. */
export function resolveMetricTile(
  hass: HomeAssistant | undefined,
  config: MetricEntityConfig,
  primaryEntityId?: string,
): MetricTileInfo {
  const stateObj = getStateObj(hass, config.entity);
  const defaults = metricDefaults(config.metric);

  // Unit and decimals: per-tile override → metric default → none.
  const unit =
    typeof config.unit === 'string' && config.unit.length > 0
      ? config.unit
      : defaults?.unit ?? '';
  const decimals =
    typeof config.decimals === 'number' ? config.decimals : defaults?.decimals ?? 2;

  // Name: custom override → metric label (short on half tiles) →
  // friendly_name → entity_id → "Unknown". Overrides are already trimmed
  // by normalizeMetricConfig.
  const friendly = stateObj?.attributes?.friendly_name;
  const metricLabel = defaults
    ? config.columns === 2 ? defaults.short : defaults.label
    : '';
  let name: string;
  if (config.name && config.name.length > 0) {
    name = config.name;
  } else if (metricLabel.length > 0) {
    name = metricLabel;
  } else if (typeof friendly === 'string' && friendly.length > 0) {
    name = friendly;
  } else if (config.entity) {
    name = config.entity;
  } else {
    name = 'Unknown';
  }

  // Icon: custom override → metric default → fallback.
  const icon =
    config.icon && config.icon.length > 0
      ? config.icon
      : defaults?.icon ?? FALLBACK_TILE_ICON;

  const unavailable = isUnavailable(stateObj);
  const numeric = unavailable || !stateObj ? null : parseNumeric(stateObj.state);
  const value = unavailable
    ? stateObj?.state === 'unknown'
      ? 'Unknown'
      : 'Unavailable'
    : numeric !== null
      ? formatValue(numeric, unit, decimals)
      : statusText(stateObj);

  return {
    config,
    stateObj,
    name,
    icon,
    value,
    barPercent: barPercent(stateObj, unit),
    isUnavailable: unavailable,
    isPrimary: !!primaryEntityId && config.entity === primaryEntityId,
  };
}

/** Newest last_updated across all configured entities (for the footer). */
export function newestUpdate(
  hass: HomeAssistant | undefined,
  entities: MetricEntityConfig[],
): string {
  if (!hass) return '';
  let best = 0;
  let bestIso = '';
  for (const e of entities) {
    const stateObj = getStateObj(hass, e.entity);
    const raw = stateObj?.last_updated;
    if (!raw) continue;
    const t = Date.parse(raw);
    if (Number.isNaN(t)) continue;
    if (t > best) {
      best = t;
      bestIso = raw;
    }
  }
  return bestIso;
}

/** Header status line: the primary metric's value, or a short fallback. */
export function headerStatusText(
  hass: HomeAssistant | undefined,
  config: ScaleCardConfig,
): string {
  const primary = resolvePrimaryTile(config);
  if (!primary) return 'No metrics';
  const tile = resolveMetricTile(hass, primary);
  return tile.value;
}


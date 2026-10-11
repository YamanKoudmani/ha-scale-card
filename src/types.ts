import type { HassEntity } from 'home-assistant-js-websocket';
import type { LovelaceCardConfig } from 'custom-card-helpers';

/** Canonical body-composition metrics the card knows about.
 *  Each key carries a default label, short label, icon, unit and decimals
 *  in METRIC_DEFAULTS (see const.ts). */
export type MetricKey =
  | 'weight'
  | 'bmr'
  | 'body_fat'
  | 'bmi'
  | 'body_water'
  | 'bone_mass'
  | 'fat_free_weight'
  | 'impedance'
  | 'metabolic_age'
  | 'muscle_mass'
  | 'protein'
  | 'skeletal_muscle'
  | 'subcutaneous_fat'
  | 'visceral_fat';

/** Defaults a metric key resolves to. */
export interface MetricDefaults {
  /** Full label, used on full-width tiles. */
  label: string;
  /** Compact label, used on half-width tiles where the full name truncates. */
  short: string;
  /** MDI icon. */
  icon: string;
  /** Display unit ('' = no unit appended). */
  unit: string;
  /** Decimal places to render (trailing zeros are trimmed). */
  decimals: number;
}

/** A single metric tile. */
export interface MetricEntityConfig {
  entity: string;
  /** Canonical metric key — supplies default label, icon, unit and decimals.
   *  Optional: without it the tile falls back to friendly_name + mdi:gauge. */
  metric?: MetricKey;
  /** Optional display name override. Falls back to the metric label,
   *  then the entity's friendly_name, then the entity_id, when unset. */
  name?: string;
  /** Optional MDI icon override (e.g. "mdi:bath"). Falls back to the
   *  metric's default icon, then FALLBACK_TILE_ICON, when unset. */
  icon?: string;
  /** Optional unit override (e.g. "lb"). Falls back to the metric's unit. */
  unit?: string;
  /** Optional decimal override. Falls back to the metric's decimals. */
  decimals?: number;
  /** 1 = full width, 2 = half width. */
  columns: 1 | 2;
}

/** Root card config */
export interface ScaleCardConfig extends LovelaceCardConfig {
  type: string;
  /** Card title. Optional: falls back to the headline metric's name
   *  (e.g. "Weight"), then to "Body Composition". */
  name?: string;
  entities: MetricEntityConfig[];
  /** Optional custom icon override for the card header. */
  icon?: string;
  /** Metric key (or entity_id) the header shows as the headline reading.
   *  That entity is NOT repeated as a tile below it.
   *  Defaults to `weight` when that metric is configured, else the first entity. */
  primary?: string;
  /** Show the "Updated …" footer line built from the newest last_updated. */
  show_updated?: boolean;
  /** Draw a hairline 0-100 bar under percentage tiles. Default false. */
  show_bars?: boolean;
  /** Compact layout: tighter header, no gap between tiles. Default false. */
  compact?: boolean;
}

/** Resolved per-tile info for rendering */
export interface MetricTileInfo {
  config: MetricEntityConfig;
  stateObj: HassEntity | null;
  name: string;
  /** Resolved icon to render. Always set (falls back to FALLBACK_TILE_ICON). */
  icon: string;
  /** Formatted value line, e.g. "79.13 kg", "20.3%", "Unavailable". */
  value: string;
  /** 0-100 bar width for percentage metrics, null for anything else. */
  barPercent: number | null;
  isUnavailable: boolean;
}

import type { MetricEntityConfig, MetricKey, MetricDefaults } from './types';

export const CARD_VERSION = '1.1.0';

/** Accent color for the active reading + icons (health teal).
 *  Overridable per dashboard with `--accent-on`. */
export const ACCENT_ON = '#4db6ac';

/** Header icon — static, since a scale has no on/off state.
 *  A custom `icon` in the card config overrides it. */
export const HEADER_ICON = 'mdi:scale';

/** Tile fallback icon (used only when the tile has no metric key). */
export const FALLBACK_TILE_ICON = 'mdi:gauge';

/** Default layout values */
export const DEFAULT_COLUMNS: 1 | 2 = 1; // 1 = full width, 2 = half width

/** Metric key → default label / icon / unit / decimals.
 *  `short` is what half-width tiles show, because "Subcutaneous Fat
 *  Percentage" truncates on a half tile but reads fine on a full one. */
export const METRIC_DEFAULTS: Record<MetricKey, MetricDefaults> = {
  weight:            { label: 'Weight',                     short: 'Weight',          icon: 'mdi:scale',            unit: 'kg',  decimals: 2 },
  bmr:               { label: 'Basal Metabolic Rate',       short: 'BMR',             icon: 'mdi:fire',             unit: 'cal', decimals: 0 },
  body_fat:          { label: 'Body Fat Percentage',        short: 'Body Fat',        icon: 'mdi:chart-donut',      unit: '%',   decimals: 1 },
  bmi:               { label: 'Body Mass Index',            short: 'BMI',             icon: 'mdi:chart-line',       unit: '',    decimals: 2 },
  body_water:        { label: 'Body Water Percentage',      short: 'Body Water',      icon: 'mdi:water',            unit: '%',   decimals: 1 },
  bone_mass:         { label: 'Bone Mass',                  short: 'Bone Mass',       icon: 'mdi:bone',             unit: 'kg',  decimals: 2 },
  fat_free_weight:   { label: 'Fat Free Weight',            short: 'Fat-Free',        icon: 'mdi:weight',           unit: 'kg',  decimals: 2 },
  impedance:         { label: 'Impedance',                  short: 'Impedance',       icon: 'mdi:omega',            unit: 'Ω', decimals: 0 },
  metabolic_age:     { label: 'Metabolic Age',              short: 'Metabolic Age',   icon: 'mdi:calendar-clock',   unit: '',    decimals: 0 },
  muscle_mass:       { label: 'Muscle Mass',                short: 'Muscle Mass',     icon: 'mdi:dumbbell',         unit: 'kg',  decimals: 2 },
  protein:           { label: 'Protein Percentage',         short: 'Protein',         icon: 'mdi:egg',              unit: '%',   decimals: 1 },
  skeletal_muscle:   { label: 'Skeletal Muscle Percentage', short: 'Skeletal Muscle', icon: 'mdi:dumbbell',         unit: '%',   decimals: 1 },
  subcutaneous_fat:  { label: 'Subcutaneous Fat Percentage',short: 'Subcut. Fat',     icon: 'mdi:layers',           unit: '%',   decimals: 1 },
  visceral_fat:      { label: 'Visceral Fat Value',         short: 'Visceral Fat',    icon: 'mdi:heart',            unit: '',    decimals: 0 },
};

/** Ordered metric keys — used by the editor dropdown. */
export const METRIC_KEYS: MetricKey[] = [
  'weight',
  'bmr',
  'body_fat',
  'bmi',
  'body_water',
  'bone_mass',
  'fat_free_weight',
  'impedance',
  'metabolic_age',
  'muscle_mass',
  'protein',
  'skeletal_muscle',
  'subcutaneous_fat',
  'visceral_fat',
];

/** Resolve the defaults for a metric key (undefined when the key is unknown). */
export function metricDefaults(metric?: MetricKey): MetricDefaults | undefined {
  if (!metric) return undefined;
  return METRIC_DEFAULTS[metric];
}

/** Normalise a MetricEntityConfig entry to a strict shape.
 *  Accepts bare strings ("sensor.weight") and preserves every override. */
export function normalizeMetricConfig(input: unknown): MetricEntityConfig {
  if (typeof input === 'string') {
    return { entity: input, columns: DEFAULT_COLUMNS };
  }
  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    const entity = typeof obj.entity === 'string' ? obj.entity : '';
    const columns: 1 | 2 = obj.columns === 2 ? 2 : 1;
    const out: MetricEntityConfig = { entity, columns };

    if (typeof obj.metric === 'string' && obj.metric in METRIC_DEFAULTS) {
      out.metric = obj.metric as MetricKey;
    }
    if (typeof obj.name === 'string' && obj.name.trim().length > 0) {
      out.name = obj.name.trim();
    }
    if (typeof obj.icon === 'string' && obj.icon.trim().length > 0) {
      out.icon = obj.icon.trim();
    }
    if (typeof obj.unit === 'string' && obj.unit.trim().length > 0) {
      out.unit = obj.unit.trim();
    }
    if (typeof obj.decimals === 'number' && Number.isFinite(obj.decimals)) {
      out.decimals = Math.max(0, Math.min(6, Math.round(obj.decimals)));
    }
    return out;
  }
  return { entity: '', columns: DEFAULT_COLUMNS };
}

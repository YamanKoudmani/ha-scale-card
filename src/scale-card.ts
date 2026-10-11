import { LitElement, html, css, nothing, unsafeCSS, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';

import {
  ACCENT_ON,
  CARD_VERSION,
  HEADER_ICON,
  normalizeMetricConfig,
} from './const';
import type { ScaleCardConfig, MetricTileInfo, MetricEntityConfig } from './types';
import {
  formatRelativeTime,
  headerStatusText,
  newestUpdate,
  resolveMetricTile,
  resolvePrimaryTile,
} from './utils';

import './editor';

@customElement('scale-card')
export class ScaleCard extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config?: ScaleCardConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement('scale-card-editor') as HTMLElement;
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      name: 'Body Composition',
      entities: [
        { entity: 'sensor.weight', metric: 'weight', columns: 1 },
        { entity: 'sensor.body_fat', metric: 'body_fat', columns: 2 },
        { entity: 'sensor.bmi', metric: 'bmi', columns: 2 },
        { entity: 'sensor.bmr', metric: 'bmr', columns: 2 },
        { entity: 'sensor.muscle_mass', metric: 'muscle_mass', columns: 2 },
      ],
    };
  }

  getCardSize(): number {
    // Masonry view: HA queries this once when placing the card and
    // allocates `size * 50px` of vertical space. The base accounts for the
    // card chrome (header + padding + grid margin) above the tile grid;
    // _computeRows() counts the tile rows themselves.
    // Sections view ignores this and uses getGridOptions() instead.
    return this._baseRows() + this._computeRows();
  }

  getGridOptions(): {
    rows: number | 'auto';
    columns: number;
    min_columns: number;
    max_columns: number;
  } {
    // Sections view: `rows: 'auto'` tells HA's grid section to size the cell
    // to fit the actual rendered height, which is what a content-driven card
    // like this needs (the same approach hui-error-card uses). Re-evaluated
    // on every render, so adding/removing tiles reflows the cell too.
    return {
      rows: 'auto',
      columns: 12,
      min_columns: 6,
      max_columns: 12,
    };
  }

  /** Chrome (header + padding + grid margin + footer) above the tile grid,
   *  in masonry-view units (50px each). */
  private _baseRows(): number {
    return this._config?.compact ? 1 : 2;
  }

  public setConfig(config: ScaleCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }
    if (!config.name) {
      throw new Error('You must define a `name` for the card');
    }
    if (!Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('You must define at least one entity in `entities`');
    }

    // Normalise: accept bare strings, default columns to 1, and PRESERVE the
    // per-entity metric/name/icon/unit/decimals overrides.
    const entities = config.entities
      .map((e) => normalizeMetricConfig(e))
      .filter((e) => e.entity.length > 0);

    if (entities.length === 0) {
      throw new Error('No valid sensor entities found in `entities`');
    }

    // Normalise optional strings: empty → undefined so a cleared editor
    // picker removes the field rather than emitting `icon: ''` in YAML.
    const rawIcon = typeof config.icon === 'string' ? config.icon.trim() : '';
    const rawPrimary = typeof config.primary === 'string' ? config.primary.trim() : '';

    this._config = {
      ...config,
      type: config.type ?? 'custom:scale-card',
      entities,
      icon: rawIcon.length > 0 ? rawIcon : undefined,
      primary: rawPrimary.length > 0 ? rawPrimary : undefined,
    };
  }

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has('_config')) return true;
    if (!changedProperties.has('hass')) return true;

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
    const newHass = this.hass;
    if (!oldHass || !newHass) return true;

    const cfg = this._config;
    if (!cfg) return true;

    for (const e of cfg.entities) {
      if (oldHass.states[e.entity] !== newHass.states[e.entity]) return true;
    }
    return false;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    const cfg = this._config;
    const primary: MetricEntityConfig | null = resolvePrimaryTile(cfg);
    const primaryId = primary?.entity ?? '';
    const tiles: MetricTileInfo[] = cfg.entities.map((e) =>
      resolveMetricTile(this.hass, e, primaryId),
    );

    const headerIcon = cfg.icon ?? HEADER_ICON;
    const headerStatus = headerStatusText(this.hass, cfg);
    const hasData = tiles.some((t) => !t.isUnavailable);
    const updated = cfg.show_updated
      ? formatRelativeTime(newestUpdate(this.hass, cfg.entities))
      : '';

    return html`
      <ha-card class=${cfg.compact ? 'compact' : ''}>
        <div class="card-inner">
          <div
            class="header ${hasData ? 'on' : 'off'}"
            data-header
            role="button"
            tabindex="0"
            aria-label=${primaryId ? `Open ${primaryId}` : cfg.name}
            @click=${this._onHeaderClick}
            @keydown=${this._onHeaderKey}
          >
            <ha-icon class="header-icon" icon=${headerIcon}></ha-icon>
            <div class="header-name">${cfg.name}</div>
            <div class="header-status">${headerStatus}</div>
          </div>

          <div class="grid">
            ${tiles.map((tile) => this._renderTile(tile))}
          </div>

          ${updated
            ? html`<div class="footer">Updated ${updated}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderTile(tile: MetricTileInfo): TemplateResult {
    const { config, name, icon, value, barPercent, isUnavailable, isPrimary } = tile;
    const stateClass = isUnavailable ? 'unavailable' : 'live';
    const sizeClass = config.columns === 2 ? 'tile-half' : 'tile-full';
    const showBar = this._config?.show_bars === true && barPercent !== null;

    return html`
      <div
        class="tile ${sizeClass} ${stateClass} ${isPrimary ? 'hero' : ''}"
        data-tile
        data-entity-id=${config.entity}
        role="button"
        tabindex="0"
        aria-label=${`${name}: ${value}`}
        @click=${this._onTileClick}
        @keydown=${this._onTileKey}
      >
        <div class="tile-icon-wrap">
          <ha-icon class="tile-icon ${stateClass}" icon=${icon}></ha-icon>
        </div>
        <div class="tile-text">
          <div class="tile-name">${name}</div>
          <div class="tile-value ${stateClass}">${value}</div>
          ${showBar
            ? html`
              <div class="tile-bar">
                <div class="tile-bar-fill" style="width: ${barPercent}%"></div>
              </div>
            `
            : nothing}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Event handling: a scale has nothing to toggle, so every tap opens the
  // entity's more-info dialog (same affordance as the Washer Dryer Card).
  // ---------------------------------------------------------------------------

  private _onHeaderClick = (): void => {
    if (!this._config) return;
    const primary = resolvePrimaryTile(this._config);
    this._openMoreInfo(primary?.entity);
  };

  private _onTileClick = (e: MouseEvent): void => {
    const tile = e.currentTarget as HTMLElement | null;
    const entityId = tile?.dataset.entityId;
    if (!entityId) return;
    e.preventDefault();
    e.stopPropagation();
    this._openMoreInfo(entityId);
  };

  private _onHeaderKey = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onHeaderClick();
    }
  };

  private _onTileKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement | null;
    this._openMoreInfo(target?.dataset.entityId);
  };

  private _openMoreInfo(entityId?: string): void {
    if (!entityId) return;
    fireEvent(this, 'hass-more-info', { entityId });
  }

  // ---------------------------------------------------------------------------
  // Layout helpers
  // ---------------------------------------------------------------------------

  /** Count grid rows for getCardSize (masonry view). Half tiles stack two
   *  per row; full tiles (and the hero tile) take a whole row. */
  private _computeRows(): number {
    if (!this._config) return 0;
    let fullRows = 0;
    let halfCount = 0;
    for (const e of this._config.entities) {
      if (e.columns === 1) fullRows += 1;
      else halfCount += 1;
    }
    return fullRows + Math.ceil(halfCount / 2);
  }

  static styles = css`
    :host {
      display: block;
      --_scale-accent: ${unsafeCSS(ACCENT_ON)};
    }
    ha-card {
      border-radius: 12px;
      /* Symmetric vertical padding so the last tile row has visual breathing
         room from the card's bottom edge. */
      padding: 12px 16px;
      box-sizing: border-box;
      max-width: 100%;
      overflow: hidden;
      /* Do NOT override --ha-card-background here: ha-card's own :host rule
         already applies the theme's value, and every override breaks a
         different theme (glassmorphic, light, black-wallpaper). Leaving it
         alone makes the card match the dashboard surface everywhere. */
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, none);
      backdrop-filter: var(--ha-card-backdrop-filter, none);
      --ha-card-border-color: transparent;
    }
    .card-inner {
      display: flex;
      flex-direction: column;
    }

    /* Header ---------------------------------------------------------------- */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 12px 6px 8px;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      transition: background-color 0.15s ease;
      text-align: center;
    }
    .header:hover {
      background-color: var(--divider-color, rgba(0, 0, 0, 0.05));
    }
    .header:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .header-icon {
      --mdc-icon-size: 36px;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .header.on .header-icon {
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .header.off .header-icon {
      color: var(--secondary-text-color, #9e9e9e);
    }
    .header-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .header-status {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }
    .header.on .header-status {
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }

    /* Grid ----------------------------------------------------------------- */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 14px;
    }

    /* Tile ----------------------------------------------------------------- */
    .tile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      /* Tiles default to transparent so they impose no colour of their own —
         they show the card's (theme-owned) surface through and separate by
         border + the accent ring on the hero tile. */
      background: var(--ha-card-background-tile, transparent);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      min-width: 0;
      box-sizing: border-box;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .tile:hover {
      background-color: var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .tile:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .tile-full {
      grid-column: 1 / -1;
    }
    .tile-half {
      grid-column: span 1;
    }
    .tile.unavailable {
      opacity: 0.55;
    }
    .tile.hero {
      border-color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .tile-icon-wrap {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tile-icon {
      --mdc-icon-size: 22px;
      display: flex;
    }
    .tile-icon.live {
      color: var(--accent-on, var(--_scale-accent, #4db6ac)) !important;
    }
    .tile-icon.unavailable {
      color: var(--disabled-text-color, #9e9e9e) !important;
    }
    .tile-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tile-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile-value {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      line-height: 1.3;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile.hero .tile-value {
      font-size: 18px;
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .tile.unavailable .tile-value {
      color: var(--disabled-text-color, #9e9e9e);
    }

    /* Hairline 0-100 bar for percentage metrics (opt-in via show_bars) */
    .tile-bar {
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, rgba(0, 0, 0, 0.1));
      overflow: hidden;
      margin-top: 4px;
    }
    .tile-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--accent-on, var(--_scale-accent, #4db6ac));
      transition: width 0.25s ease;
    }

    /* Footer --------------------------------------------------------------- */
    .footer {
      margin-top: 12px;
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    /* Compact mode --------------------------------------------------------- */
    /* Removes the gap between tiles, tightens outer/inner padding, and makes
       tile borders faint so flush-adjacent tiles don't show a double border. */
    ha-card.compact {
      padding: 8px 10px;
      border-radius: 8px;
    }
    ha-card.compact .header {
      padding: 6px 4px 4px;
      gap: 2px;
    }
    ha-card.compact .header-icon {
      --mdc-icon-size: 28px;
    }
    ha-card.compact .grid {
      gap: 0;
      margin-top: 8px;
    }
    ha-card.compact .tile {
      padding: 10px 12px;
      border-radius: 6px;
      border-color: var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    ha-card.compact .tile.hero {
      border-color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    ha-card.compact .footer {
      margin-top: 8px;
    }
  `;
}

// ---------------------------------------------------------------------------
// HACS / custom card registration
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

const accentStyle = `background:${ACCENT_ON};color:#1a1a1a;padding:2px 6px;border-radius:4px;font-weight:600`;
console.info(
  `%cSCALE-CARD%c v${CARD_VERSION} %cloaded`,
  accentStyle,
  'background:#222;color:#fff;padding:2px 6px;border-radius:4px',
  'color:#888',
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'scale-card',
  name: 'Smart Fitness Scale Card',
  description:
    'Body composition at a glance — weight, BMR, body fat, muscle mass and more. Tap any tile for more info.',
  preview: true,
});

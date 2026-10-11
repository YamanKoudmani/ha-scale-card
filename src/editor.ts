import { LitElement, html, css, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, type HomeAssistant } from 'custom-card-helpers';
import type { ScaleCardConfig, MetricEntityConfig, MetricKey } from './types';
import { METRIC_KEYS, METRIC_DEFAULTS, normalizeMetricConfig, DEFAULT_COLUMNS } from './const';

// Subset of HA's HaFormSchema covering everything we use. The full
// type lives in HA's frontend and isn't exported via custom-card-helpers.
interface HaFormSchemaItem {
  name: string;
  type?: string;
  schema?: HaFormSchemaItem[];
  selector?: Record<string, unknown>;
  context?: Record<string, unknown>;
}
type HaFormSchema = HaFormSchemaItem[];

@customElement('scale-card-editor')
export class ScaleCardEditor extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config?: ScaleCardConfig;

  public setConfig(config: ScaleCardConfig): void {
    const entities = Array.isArray(config.entities) ? config.entities : [];
    this._config = {
      ...config,
      name: config.name ?? '',
      icon: config.icon ?? '',
      primary: config.primary ?? '',
      entities: entities.map((e) => normalizeMetricConfig(e)),
    };
  }

  /** Dropdown options for the headline metric: the configured entities.
   *  Value is always an entity_id so whatever the user picks is guaranteed
   *  to resolve to a tile. */
  private _primaryOptions(): Array<{ value: string; label: string }> {
    const entities = (this._config?.entities ?? []).filter((e) => e.entity.length > 0);
    return entities.map((e) => {
      const friendly = this.hass?.states?.[e.entity]?.attributes?.friendly_name;
      const label =
        e.name ||
        (e.metric ? METRIC_DEFAULTS[e.metric].label : '') ||
        (typeof friendly === 'string' && friendly.length > 0 ? friendly : e.entity);
      return { value: e.entity, label };
    });
  }

  /** Current primary as an entity_id. A YAML `primary` written as a metric key
   *  is mapped to its entity so the dropdown shows the right row. */
  private _primaryValue(): string {
    const cfg = this._config;
    if (!cfg?.primary) return '';
    const match = cfg.entities.find(
      (e) => e.entity === cfg.primary || e.metric === cfg.primary,
    );
    return match?.entity ?? '';
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) return html``;
    const cfg = this._config;

    const rootSchema: HaFormSchema = [
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      {
        name: 'primary',
        selector: {
          select: {
            // Options are the CONFIGURED entities, not the metric registry.
            // A metric-key dropdown can never resolve when the tiles were
            // added without a `metric` (the usual case), so the picker would
            // silently fall back to Weight / the first entity — which is the
            // bug this fixes. Value is always an entity_id, so the choice
            // always matches a tile.
            options: [
              { value: '', label: 'Auto (Weight, else first entity)' },
              ...this._primaryOptions(),
            ],
            mode: 'dropdown',
          },
        },
      },
      { name: 'show_updated', selector: { boolean: {} } },
      { name: 'show_bars', selector: { boolean: {} } },
      { name: 'compact', selector: { boolean: {} } },
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          name: cfg.name,
          icon: cfg.icon ?? '',
          primary: this._primaryValue(),
          show_updated: cfg.show_updated === true,
          show_bars: cfg.show_bars === true,
          compact: cfg.compact === true,
        }}
        .schema=${rootSchema}
        .computeLabel=${this._computeRootLabel}
        .computeHelper=${this._computeRootHelper}
        @value-changed=${this._rootFormChanged}
      ></ha-form>

      <div class="entities-section">
        <div class="section-title">Entities</div>
        ${cfg.entities.map((e, i) => this._renderEntitySection(e, i))}
        <ha-button class="add-btn" @click=${this._addEntity}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add entity
        </ha-button>
      </div>
    `;
  }

  private _renderEntitySection(
    e: MetricEntityConfig,
    index: number,
  ): TemplateResult {
    // Layout mirrors the Room Lights Card editor:
    // 1. Entity selector (full width).
    // 2. Metric + display name (full width each).
    // 3. Tile width & Custom Icon (side-by-side, both floating-label so
    //    they align perfectly on the same row).
    const entitySchema: HaFormSchema = [
      { name: 'entity', selector: { entity: { domain: 'sensor' } } },
      {
        name: 'metric',
        selector: {
          select: {
            options: [
              { value: '', label: 'Auto (friendly name + mdi:gauge)' },
              ...METRIC_KEYS.map((k) => ({ value: k, label: METRIC_DEFAULTS[k].label })),
            ],
            mode: 'dropdown',
          },
        },
      },
      { name: 'name', selector: { text: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'columns',
            selector: {
              select: {
                options: [
                  { value: 1, label: 'Full' },
                  { value: 2, label: 'Half' },
                ],
                mode: 'dropdown',
              },
            },
          },
          {
            name: 'icon',
            selector: { icon: {} },
            context: { icon_entity: 'entity' },
          },
        ],
      },
    ];

    const total = this._config?.entities.length ?? 0;

    return html`
      <div class="entity-section">
        <ha-form
          .hass=${this.hass}
          .data=${{
            entity: e.entity,
            metric: e.metric ?? '',
            name: e.name ?? '',
            columns: e.columns,
            icon: e.icon ?? '',
          }}
          .schema=${entitySchema}
          .computeLabel=${this._computeEntityLabel}
          .computeHelper=${this._computeEntityHelper}
          @value-changed=${(ev: CustomEvent) => this._entityFormChanged(index, ev)}
        ></ha-form>
        <div class="entity-actions">
          <ha-icon-button
            .label=${'Move up'}
            .disabled=${index === 0}
            @click=${() => this._moveEntity(index, -1)}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${'Move down'}
            .disabled=${index === total - 1}
            @click=${() => this._moveEntity(index, 1)}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            class="remove-btn"
            .label=${'Remove entity'}
            @click=${() => this._removeEntity(index)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </ha-icon-button>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Form change handlers
  // ---------------------------------------------------------------------------

  private _rootFormChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = (
      ev.detail as {
        value: {
          name?: string;
          icon?: string;
          primary?: string;
          show_updated?: boolean;
          show_bars?: boolean;
          compact?: boolean;
        };
      }
    ).value;

    // Booleans and optional strings are dropped when off/empty so the YAML
    // stays clean (no `compact: false` on every config).
    const newConfig: ScaleCardConfig = {
      ...this._config,
      name: value.name ?? '',
      icon: value.icon && value.icon.trim().length > 0 ? value.icon.trim() : undefined,
      primary: value.primary && value.primary.length > 0 ? value.primary : undefined,
      show_updated: value.show_updated === true ? true : undefined,
      show_bars: value.show_bars === true ? true : undefined,
      compact: value.compact === true ? true : undefined,
    };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _entityFormChanged(index: number, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = (
      ev.detail as {
        value: {
          entity: string;
          metric: string;
          name: string;
          columns: number | string;
          icon: string;
        };
      }
    ).value;

    const updated: MetricEntityConfig = {
      entity: value.entity,
      columns: Number(value.columns) === 2 ? 2 : 1,
    };
    if (value.metric && value.metric in METRIC_DEFAULTS) {
      updated.metric = value.metric as MetricKey;
    }
    if (value.name && value.name.length > 0) updated.name = value.name;
    if (value.icon && value.icon.length > 0) updated.icon = value.icon;

    const entities = [...this._config.entities];
    entities[index] = updated;
    const newConfig: ScaleCardConfig = { ...this._config, entities };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  // ---------------------------------------------------------------------------
  // Label / helper translations
  // ---------------------------------------------------------------------------

  private _computeRootLabel = (schema: HaFormSchemaItem): string => {
    if (schema.name === 'name') return 'Card name';
    if (schema.name === 'icon') return 'Card icon (optional)';
    if (schema.name === 'primary') return 'Headline metric';
    if (schema.name === 'show_updated') return 'Show "Updated …" line';
    if (schema.name === 'show_bars') return 'Show bars for percentages';
    if (schema.name === 'compact') return 'Compact mode';
    return '';
  };

  private _computeRootHelper = (schema: HaFormSchemaItem): string => {
    if (schema.name === 'icon') {
      return 'When set, this icon always shows in the header. When left empty, the header shows mdi:scale.';
    }
    if (schema.name === 'primary') {
      return 'The value shown under the card name. The entity you pick here is the headline, so it is NOT repeated as a tile below it. Auto uses Weight when configured, otherwise the first entity.';
    }
    if (schema.name === 'show_updated') {
      return 'Shows how old the newest reading is (e.g. "Updated 2 hr ago").';
    }
    if (schema.name === 'show_bars') {
      return 'Draws a hairline 0-100 bar under percentage tiles (body fat, water, protein, …).';
    }
    if (schema.name === 'compact') {
      return 'Removes the gap between tiles and tightens padding. Useful when you have many metrics and want a denser layout.';
    }
    return '';
  };

  private _computeEntityLabel = (schema: HaFormSchemaItem): string => {
    if (schema.name === 'entity') return 'Sensor';
    if (schema.name === 'metric') return 'Metric (optional)';
    if (schema.name === 'name') return 'Display name (optional)';
    if (schema.name === 'columns') return 'Tile width';
    if (schema.name === 'icon') return 'Icon (optional)';
    return '';
  };

  private _computeEntityHelper = (schema: HaFormSchemaItem): string => {
    if (schema.name === 'metric') {
      return 'Picks the label, icon, unit and decimals for this sensor. Leave on Auto to use the entity friendly name.';
    }
    return '';
  };

  // ---------------------------------------------------------------------------
  // Entity list management
  // ---------------------------------------------------------------------------

  private _addEntity = (): void => {
    if (!this._config) return;
    const entities = [
      ...this._config.entities,
      { entity: '', columns: DEFAULT_COLUMNS },
    ];
    const newConfig: ScaleCardConfig = { ...this._config, entities };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  };

  private _removeEntity(index: number): void {
    if (!this._config) return;
    const entities = this._config.entities.filter((_, i) => i !== index);
    const newConfig: ScaleCardConfig = { ...this._config, entities };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _moveEntity(index: number, direction: -1 | 1): void {
    if (!this._config) return;
    const target = index + direction;
    const entities = this._config.entities;
    if (target < 0 || target >= entities.length) return;
    // Copy before swapping so we never mutate the previous config object
    // (which would confuse the diff + undo in the HA editor).
    const next = [...entities];
    [next[index], next[target]] = [next[target], next[index]];
    const newConfig: ScaleCardConfig = { ...this._config, entities: next };
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  // ---------------------------------------------------------------------------
  // Styles: only the section wrapper + trash button position. All input
  // styling is delegated to <ha-form> for native theming.
  // ---------------------------------------------------------------------------

  static styles = css`
    :host {
      display: block;
    }
    .entities-section {
      margin-top: 16px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 16px 0 8px;
    }
    .entity-section {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .entity-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      margin-top: 8px;
      padding-top: 4px;
    }
    .entity-actions ha-icon-button {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
    .remove-btn {
      color: var(--error-color, #b71c1c);
    }
    .add-btn {
      align-self: flex-start;
      margin-top: 4px;
    }
  `;
}

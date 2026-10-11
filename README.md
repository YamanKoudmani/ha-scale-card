# Smart Fitness Scale Card

A Lovelace card for Home Assistant that puts a smart fitness scale's body-composition readings on one clean, at-a-glance card — weight, BMR, body fat, muscle mass, impedance and the rest, each in its own tile with its own icon.

Built in the same design language as the [Room Lights Card](https://github.com/YamanKoudmani/room-lights-card): a centred header, a tile grid, theme-driven colours, tap-for-more-info, and a compact mode for dense dashboards.

[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Lovelace-41BDF5.svg)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/badge/version-1.0.0-4db6ac.svg)](https://github.com/YamanKoudmani/ha-scale-card/releases)

<p align="center">
  <img src="docs/screenshot.png" alt="Smart Fitness Scale Card screenshot" width="600" />
</p>

> No screenshot yet? Drop your rendered card image at `docs/screenshot.png` and it will appear above.

---

## Features

- **Tile grid of metrics** — every sensor gets its own tile: icon, label, value
- **Metric registry** — 14 known metrics come with a sensible label, icon, unit and decimal count out of the box
- **Headline metric** — the header shows your primary reading (Weight by default) and highlights that tile with the accent colour
- **Short labels on half tiles** — "Subcutaneous Fat Percentage" becomes "Subcut. Fat" so half-width tiles never truncate
- **Optional 0-100 bars** — hairline progress bars under percentage metrics (`show_bars`)
- **"Updated …" line** — scales report infrequently, so the footer shows how stale the newest reading is
- **Tap any tile** — opens the entity's more-info dialog (keyboard `Enter`/`Space` too)
- **Visual editor** — every option is configurable from the Lovelace card editor
- **Sections view ready** — exposes `getGridOptions()` for the new dashboard layout
- **Adaptive theming** — uses Home Assistant CSS variables, so it follows your current theme
- **Pure TypeScript + Lit**, no runtime dependencies beyond `lit` and `custom-card-helpers`

---

## Installation

### HACS (recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed in Home Assistant.
2. Add this repository as a **Custom Repository** in HACS:
   - Go to **HACS → ⋮ → Custom repositories**
   - **Repository**: `https://github.com/YamanKoudmani/ha-scale-card`
   - **Category**: `Lovelace`
3. Search for **Smart Fitness Scale Card** in HACS and install it.
4. Restart Home Assistant.
5. Add the resource (HACS should do this automatically):
   - **Settings → Dashboards → Resources → Add Resource**
   - **URL**: `/hacsfiles/ha-scale-card/scale-card.js`
   - **Type**: `JavaScript Module`

### Manual

1. Download `scale-card.js` from the latest release.
2. Copy it to `config/www/scale-card.js` in your Home Assistant configuration directory.
3. Add the resource:
   - **Settings → Dashboards → Resources → Add Resource**
   - **URL**: `/local/scale-card.js`
   - **Type**: `JavaScript Module`
4. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## Configuration

### Quick start

```yaml
type: custom:scale-card
name: Body Composition
primary: weight            # headline metric, defaults to weight
show_updated: true
entities:
  - entity: sensor.weight
    metric: weight
    columns: 1
  - entity: sensor.body_fat
    metric: body_fat
    columns: 2
  - entity: sensor.bmi
    metric: bmi
    columns: 2
  - entity: sensor.bmr
    metric: bmr
    columns: 2
  - entity: sensor.body_water
    metric: body_water
    columns: 2
  - entity: sensor.bone_mass
    metric: bone_mass
    columns: 2
  - entity: sensor.fat_free_mass
    metric: fat_free_weight
    columns: 2
  - entity: sensor.impedance
    metric: impedance
    columns: 2
  - entity: sensor.metabolic_age
    metric: metabolic_age
    columns: 2
  - entity: sensor.muscle_mass
    metric: muscle_mass
    columns: 2
  - entity: sensor.protein
    metric: protein
    columns: 2
  - entity: sensor.skeletal_muscle
    metric: skeletal_muscle
    columns: 2
  - entity: sensor.subcutaneous_fat
    metric: subcutaneous_fat
    columns: 2
  - entity: sensor.visceral_fat
    metric: visceral_fat
    columns: 2
```

### Visual editor

The card registers a visual editor (find it under **Add card → By card → Smart Fitness Scale Card**). Card name, headline metric, footer, bars, compact mode and every entity (metric, display name, tile width, icon) are configurable from the UI.

---

## Configuration variables

### Card options

| Name           | Type    | Default        | Description                                                                                          |
| -------------- | ------- | -------------- | -------------------------------------------------------------------------------------- |
| `type`         | string  | **required**   | `custom:scale-card`                                                                    |
| `name`         | string  | **required**   | Display name shown in the card header                                                  |
| `entities`     | array   | **required**   | List of sensor entities to show. See [Entity options](#entity-options)                 |
| `icon`         | string  | `mdi:scale`    | Optional header icon override                                                          |
| `primary`      | string  | `weight`       | Metric key **or** entity_id shown in the header status line and highlighted with the accent colour. Falls back to the first entity when the metric is not configured |
| `show_updated` | boolean | `false`        | Footer line: `Updated 12 min ago`, `Updated 2 hr ago`, `Updated 2 d ago`, then a date  |
| `show_bars`    | boolean | `false`        | Hairline 0-100 bar under percentage tiles                                              |
| `compact`      | boolean | `false`        | Tighter layout: smaller header, no gap between tiles, tighter padding                  |

### Entity options

| Key        | Type       | Default                | Description                                                              |
| ---------- | ---------- | ---------------------- | ------------------------------------------------------------------------ |
| `entity`   | string     | —                      | A `sensor.*` entity id                                                   |
| `metric`   | string     | *(none)*               | Canonical metric key — supplies the label, icon, unit and decimals. See [Metric keys](#metric-keys) |
| `name`     | string     | metric label           | Display name override. On half tiles the metric's short label is used unless you set `name` |
| `icon`     | string     | metric icon            | MDI icon override (e.g. `mdi:bath`). Fixed regardless of state           |
| `unit`     | string     | metric unit            | Unit override (e.g. `lb`). Percentages hug the number, other units get a space |
| `decimals` | number     | metric decimals        | Decimal places to render (0-6). Trailing zeros are trimmed               |
| `columns`  | `1` \| `2` | `1`                    | `1` = full-width, `2` = half-width                                       |

### Metric keys

| Key               | Label                       | Half-tile label   | Icon                 | Unit  | Decimals |
| ----------------- | --------------------------- | ----------------- | -------------------- | ----- | -------- |
| `weight`          | Weight                      | Weight            | `mdi:scale`          | kg    | 2        |
| `bmr`             | Basal Metabolic Rate        | BMR               | `mdi:fire`           | cal   | 0        |
| `body_fat`        | Body Fat Percentage         | Body Fat          | `mdi:chart-donut`    | %     | 1        |
| `bmi`             | Body Mass Index             | BMI               | `mdi:chart-line`     | —     | 2        |
| `body_water`      | Body Water Percentage       | Body Water        | `mdi:water`          | %     | 1        |
| `bone_mass`       | Bone Mass                   | Bone Mass         | `mdi:bone`           | kg    | 2        |
| `fat_free_weight` | Fat Free Weight             | Fat-Free          | `mdi:weight`         | kg    | 2        |
| `impedance`       | Impedance                   | Impedance         | `mdi:omega`          | Ω     | 0        |
| `metabolic_age`   | Metabolic Age               | Metabolic Age     | `mdi:calendar-clock` | —     | 0        |
| `muscle_mass`     | Muscle Mass                 | Muscle Mass       | `mdi:dumbbell`       | kg    | 2        |
| `protein`         | Protein Percentage          | Protein           | `mdi:egg`            | %     | 1        |
| `skeletal_muscle` | Skeletal Muscle Percentage  | Skeletal Muscle   | `mdi:dumbbell`       | %     | 1        |
| `subcutaneous_fat`| Subcutaneous Fat Percentage | Subcut. Fat       | `mdi:layers`         | %     | 1        |
| `visceral_fat`    | Visceral Fat Value          | Visceral Fat      | `mdi:heart`          | —     | 0        |

A tile with no `metric` key falls back to the entity's `friendly_name` and `mdi:gauge`, and prints the raw state as-is.

---

## Behaviour

- **Tap a tile** — opens the more-info dialog for that sensor.
- **Tap the header** — opens the more-info dialog for the headline metric.
- **Keyboard** — `Enter`/`Space` on a focused tile or header does the same.
- Values are formatted with thousands separators (`1,732 cal`) and trailing zeros trimmed (`20.3%`, not `20.30%`).
- If a sensor is `unavailable` or `unknown`, its tile is dimmed and shows `Unavailable` / `Unknown`.
- The accent colour is `#4db6ac` by default. Override it per dashboard with `--accent-on`.

---

## Examples

### Compact card for a sidebar

```yaml
type: custom:scale-card
name: Body Composition
compact: true
primary: weight
entities:
  - sensor.weight
  - sensor.body_fat
  - sensor.muscle_mass
  - sensor.bmr
```

Bare strings are accepted; they get `columns: 1` and the generic icon.

### Bars under the percentages

```yaml
type: custom:scale-card
name: Body Composition
show_bars: true
show_updated: true
entities:
  - entity: sensor.weight
    metric: weight
    columns: 1
  - entity: sensor.body_fat
    metric: body_fat
    columns: 2
  - entity: sensor.protein
    metric: protein
    columns: 2
```

### Pounds instead of kilograms

```yaml
type: custom:scale-card
name: Body Composition
entities:
  - entity: sensor.weight_lb
    metric: weight
    unit: lb
    decimals: 1
  - entity: sensor.bone_mass_lb
    metric: bone_mass
    unit: lb
    decimals: 1
```

### In a sections view

The card exposes `getGridOptions()`, so the sections layout sizes it automatically.

```yaml
type: grid
columns: 6
square: false
cards:
  - type: custom:scale-card
    name: Body Composition
    show_updated: true
    entities:
      - entity: sensor.weight
        metric: weight
        columns: 1
      - entity: sensor.body_fat
        metric: body_fat
        columns: 2
```

---

## Troubleshooting

**The card shows an error about `entities`**
At least one entity is required, and `name` is required too.

**Values look wrong**
The card formats the entity's **state** as a number. If your integration stores the reading in an attribute instead of the state, create a template sensor that exposes it as the state.

**A metric shows the raw friendly name**
That tile has no `metric` key. Add one from the [Metric keys](#metric-keys) table to get the label, icon, unit and decimals.

**The card is not in the picker**
Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`). If it's still missing, open the browser console — a `SCALE-CARD v1.0.0` banner is logged on load. If you don't see it, the resource didn't load; double-check the URL and that the file is on disk.

---

## Development

```bash
npm install
npm run build      # one-off production build into ./dist
npm start          # rollup watch mode
npm test           # vitest (74 cases over the formatting + resolution layer)
```

The built file is `dist/scale-card.js` — `hacs.json` points at this path (`content_in_root: false`).

---

## License

MIT

# Theming

Gigatable is themed through a typed `theme` prop. Theme values are resolved into CSS custom properties under the `--gt-*` namespace.

## Presets

Three presets are included:

```tsx
import { Gigatable, themes } from "./gigatable";

<Gigatable table={table} theme={themes.light} />;
<Gigatable table={table} theme={themes.dark} />;
<Gigatable table={table} theme={themes.minimal} />;
```

## Partial overrides

Pass only the values you want to change. Missing fields fall back to `themes.light`.

```tsx
<Gigatable
  table={table}
  theme={{
    row: { height: 36 },
    selection: { outline: "#22c55e" },
  }}
/>
```

## Override a preset

Spread a preset when you want to keep its baseline and replace a few tokens.

```tsx
<Gigatable
  table={table}
  theme={{
    ...themes.dark,
    header: {
      ...themes.dark.header,
      background: "var(--brand-surface)",
    },
  }}
/>
```

## Theme tokens

| Area | Fields |
| --- | --- |
| `header` | `background`, `textColor`, `borderColor`, `height`, `fontSize`, `fontFamily`, `fontWeight` |
| `row` | `height`, `background`, `hoverBackground` |
| `cell` | `borderColor`, `fontSize`, `fontFamily`, `fontWeight`, `textColor`, `paddingX`, `paddingY` |
| `selection` | `outline`, `rangeBackground` |
| `paste` | `highlightBackground`, `highlightBorderColor` |
| `fill` | `previewBackground`, `previewTextColor` |

## Value formats

String values are passed through unchanged, including CSS variables:

```tsx
<Gigatable
  table={table}
  theme={{ selection: { outline: "var(--accent)" } }}
/>
```

Number values are converted to pixel values for size fields. Font weights are converted to plain numeric strings.

## CSS variable overrides

Advanced users can override the resolved variables directly in CSS when they need integration with a broader design system.

```css
.my-grid {
  --gt-selection-outline: #0ea5e9;
  --gt-row-height: 34px;
}
```

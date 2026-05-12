/**
 * Visual customisation tokens for `<Gigatable>`. Pass a partial object — only provided
 * tokens are overridden; the rest fall back to `themes.light` values.
 */
export interface GigatableTheme {
  header?: {
    background?: string;
    textColor?: string;
    borderColor?: string;
    height?: string | number;
    fontSize?: string | number;
    fontFamily?: string;
    fontWeight?: string | number;
  };
  row?: {
    height?: string | number;
    background?: string;
    hoverBackground?: string;
  };
  cell?: {
    borderColor?: string;
    fontSize?: string | number;
    fontFamily?: string;
    fontWeight?: string | number;
    textColor?: string;
    paddingX?: string | number;
    paddingY?: string | number;
  };
  selection?: {
    outline?: string;
    rangeBackground?: string;
  };
  paste?: {
    highlightBackground?: string;
    highlightBorderColor?: string;
  };
  fill?: {
    previewBackground?: string;
    previewTextColor?: string;
  };
}

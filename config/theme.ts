/**
 * Central Theme Configuration
 *
 * This file contains all theme-related data for the application.
 * Change colors, styles, spacing here to update the entire site.
 */

// ========================================
// COLOR PALETTE
// ========================================

export const colors = {
  // Primary colors
  primary: {
    DEFAULT: "hsl(221.2 83.2% 53.3%)",
    foreground: "hsl(210 40% 98%)",
    hover: "hsl(221.2 83.2% 45%)",
    light: "hsl(221.2 83.2% 65%)",
  },

  // Secondary colors
  secondary: {
    DEFAULT: "hsl(210 40% 96.1%)",
    foreground: "hsl(222.2 47.4% 11.2%)",
    hover: "hsl(210 40% 90%)",
  },

  // Background colors
  background: {
    DEFAULT: "hsl(0 0% 100%)",
    muted: "hsl(210 40% 96.1%)",
    card: "hsl(0 0% 100%)",
  },

  // Text colors
  text: {
    primary: "hsl(222.2 84% 4.9%)",
    secondary: "hsl(215.4 16.3% 46.9%)",
    muted: "hsl(215.4 16.3% 46.9%)",
  },

  // Border colors
  border: {
    DEFAULT: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    focus: "hsl(221.2 83.2% 53.3%)",
  },

  // Semantic colors
  success: "hsl(142 76% 36%)",
  error: "hsl(0 84.2% 60.2%)",
  warning: "hsl(38 92% 50%)",
  info: "hsl(199 89% 48%)",
}

// ========================================
// BUTTON STYLES
// ========================================

export const buttonStyles = {
  // Base button styles
  base: {
    fontWeight: "500",
    borderRadius: "0.375rem", // rounded-md
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  },

  // Button sizes
  sizes: {
    sm: {
      height: "2.25rem", // h-9
      padding: "0 0.75rem", // px-3
      fontSize: "0.875rem", // text-sm
    },
    default: {
      height: "2.5rem", // h-10
      padding: "0 1rem", // px-4
      fontSize: "0.875rem", // text-sm
    },
    lg: {
      height: "2.75rem", // h-11
      padding: "0 2rem", // px-8
      fontSize: "1rem", // text-base
    },
    icon: {
      height: "2.5rem", // h-10
      width: "2.5rem", // w-10
      padding: "0",
    },
  },

  // Button variants
  variants: {
    default: {
      background: colors.primary.DEFAULT,
      color: colors.primary.foreground,
      hoverBackground: colors.primary.hover,
    },
    outline: {
      background: "transparent",
      color: colors.text.primary,
      border: `1px solid ${colors.border.DEFAULT}`,
      hoverBackground: colors.background.muted,
    },
    ghost: {
      background: "transparent",
      color: colors.text.primary,
      hoverBackground: colors.background.muted,
    },
    secondary: {
      background: colors.secondary.DEFAULT,
      color: colors.secondary.foreground,
      hoverBackground: colors.secondary.hover,
    },
    destructive: {
      background: colors.error,
      color: colors.primary.foreground,
      hoverBackground: "hsl(0 84.2% 50%)",
    },
  },
}

// ========================================
// INPUT STYLES
// ========================================

export const inputStyles = {
  base: {
    height: "2.5rem", // h-10
    width: "100%",
    borderRadius: "0.375rem", // rounded-md
    border: `1px solid ${colors.border.input}`,
    background: colors.background.DEFAULT,
    padding: "0.5rem 0.75rem", // px-3 py-2
    fontSize: "0.875rem", // text-sm
    transition: "all 0.2s ease-in-out",
  },

  focus: {
    outline: "none",
    ring: `2px solid ${colors.border.focus}`,
    ringOffset: "2px",
  },

  disabled: {
    cursor: "not-allowed",
    opacity: "0.5",
  },

  error: {
    border: `1px solid ${colors.error}`,
    ring: `2px solid ${colors.error}`,
  },
}

// ========================================
// CARD STYLES
// ========================================

export const cardStyles = {
  base: {
    borderRadius: "0.5rem", // rounded-lg
    border: `1px solid ${colors.border.DEFAULT}`,
    background: colors.background.card,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", // shadow-sm
  },

  header: {
    padding: "1.5rem", // p-6
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem", // space-y-1.5
  },

  content: {
    padding: "1.5rem", // p-6
    paddingTop: "0", // pt-0
  },

  title: {
    fontSize: "1.5rem", // text-2xl
    fontWeight: "600", // font-semibold
    lineHeight: "1",
    letterSpacing: "-0.025em", // tracking-tight
  },

  description: {
    fontSize: "0.875rem", // text-sm
    color: colors.text.muted,
  },
}

// ========================================
// RESULT BOX STYLES
// ========================================

export const resultBoxStyles = {
  container: {
    background: colors.background.muted,
    borderRadius: "0.5rem", // rounded-lg
    padding: "1.5rem", // p-6
    textAlign: "center",
    position: "relative",
  },

  icons: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    gap: "0.5rem",
  },

  label: {
    fontSize: "0.875rem", // text-sm
    color: colors.text.muted,
    marginBottom: "0.5rem",
  },

  value: {
    fontSize: "2.25rem", // text-4xl
    fontWeight: "700", // font-bold
    color: colors.primary.DEFAULT,
    marginBottom: "0.5rem",
  },

  formula: {
    fontSize: "0.875rem", // text-sm
    color: colors.text.muted,
    marginTop: "0.5rem",
  },
}

// ========================================
// LAYOUT STYLES
// ========================================

export const layoutStyles = {
  container: {
    maxWidth: "80rem", // max-w-7xl
    margin: "0 auto",
    padding: "0 1rem", // px-4
  },

  section: {
    padding: "2rem 0", // py-8
    tablet: "3rem 0", // md:py-12
  },

  grid: {
    display: "grid",
    gap: "1.5rem", // gap-6
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-2",
    desktop: "lg:grid-cols-3",
  },
}

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  // Headings
  h1: {
    fontSize: "2.25rem", // text-4xl
    fontWeight: "700", // font-bold
    lineHeight: "1.2",
    letterSpacing: "-0.025em", // tracking-tight
    mobile: "1.875rem", // sm:text-5xl
    tablet: "3rem", // md:text-6xl
  },

  h2: {
    fontSize: "1.875rem", // text-3xl
    fontWeight: "700", // font-bold
    lineHeight: "1.2",
  },

  h3: {
    fontSize: "1.5rem", // text-2xl
    fontWeight: "600", // font-semibold
    lineHeight: "1.2",
  },

  // Body text
  body: {
    fontSize: "1rem", // text-base
    lineHeight: "1.5",
    color: colors.text.primary,
  },

  small: {
    fontSize: "0.875rem", // text-sm
    lineHeight: "1.25rem",
    color: colors.text.secondary,
  },

  muted: {
    fontSize: "0.875rem", // text-sm
    color: colors.text.muted,
  },
}

// ========================================
// SPACING
// ========================================

export const spacing = {
  // Gap sizes
  gap: {
    xs: "0.25rem", // 1
    sm: "0.5rem", // 2
    md: "1rem", // 4
    lg: "1.5rem", // 6
    xl: "2rem", // 8
    "2xl": "3rem", // 12
  },

  // Padding sizes
  padding: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  // Margin sizes
  margin: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
}

// ========================================
// ANIMATIONS
// ========================================

export const animations = {
  // Transition durations
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },

  // Easing functions
  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },

  // Common transitions
  transition: {
    all: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors: "color, background-color, border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

// ========================================
// BORDER RADIUS
// ========================================

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // rounded-sm
  default: "0.25rem", // rounded
  md: "0.375rem", // rounded-md
  lg: "0.5rem", // rounded-lg
  xl: "0.75rem", // rounded-xl
  "2xl": "1rem", // rounded-2xl
  full: "9999px", // rounded-full
}

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}

// ========================================
// EXPORT ALL THEME
// ========================================

export const theme = {
  colors,
  buttonStyles,
  inputStyles,
  cardStyles,
  resultBoxStyles,
  layoutStyles,
  typography,
  spacing,
  animations,
  borderRadius,
  shadows,
}

export default theme

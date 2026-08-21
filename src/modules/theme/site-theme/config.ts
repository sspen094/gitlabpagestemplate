export type ThemeMode = 'system' | 'light' | 'dark'

export type ThemePalette = {
  text: string
  heading: string
  background: string
  surface: string
  surfaceRaised: string
  border: string
  codeBackground: string
  accent: string
  accentStrong: string
  accentSoft: string
  accentBorder: string
  backdrop: string
  danger: string
}

export type SiteTheme = {
  mode: ThemeMode
  palettes: {
    light: ThemePalette
    dark: ThemePalette
  }
  typography: {
    sans: string
    heading: string
    mono: string
    rootSize: string
    compactRootSize: string
    lineHeight: string
    letterSpacing: string
    sizeSmall: string
    sizeBody: string
    sizeLead: string
    sizeControl: string
    sizeDisplay: string
    sizeDisplayCompact: string
    sizeTitle: string
    sizeTitleCompact: string
    sizeHeading: string
  }
  spacing: {
    xxs: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  radius: {
    small: string
    medium: string
    large: string
    pill: string
  }
  shadow: {
    soft: string
    raised: string
    focus: string
  }
  layout: {
    shell: string
    reading: string
    form: string
    cardTrack: string
  }
  breakpoints: {
    compact: number
    mobile: number
  }
  zIndex: {
    dropdown: number
    backdrop: number
    drawer: number
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export const defaultTheme: SiteTheme = {
  mode: 'system',
  palettes: {
    light: {
      text: '#514a5b',
      heading: '#17121f',
      background: '#fbfafc',
      surface: '#ffffff',
      surfaceRaised: '#ffffff',
      border: '#ded9e4',
      codeBackground: '#f3eff6',
      accent: '#7a2cb7',
      accentStrong: '#5f178f',
      accentSoft: 'rgba(122, 44, 183, 0.1)',
      accentBorder: 'rgba(122, 44, 183, 0.45)',
      backdrop: 'rgba(15, 10, 20, 0.56)',
      danger: '#a51d32',
    },
    dark: {
      text: '#c7c0ce',
      heading: '#fbf8ff',
      background: '#121016',
      surface: '#1a171f',
      surfaceRaised: '#211d27',
      border: '#3c3545',
      codeBackground: '#27222e',
      accent: '#d3a0f4',
      accentStrong: '#e5c6f8',
      accentSoft: 'rgba(211, 160, 244, 0.14)',
      accentBorder: 'rgba(211, 160, 244, 0.52)',
      backdrop: 'rgba(0, 0, 0, 0.68)',
      danger: '#ff9aab',
    },
  },
  typography: {
    sans: "system-ui, 'Segoe UI', Roboto, sans-serif",
    heading: "system-ui, 'Segoe UI', Roboto, sans-serif",
    mono: 'ui-monospace, Consolas, monospace',
    rootSize: '18px',
    compactRootSize: '16px',
    lineHeight: '1.55',
    letterSpacing: '0.01em',
    sizeSmall: '0.9em',
    sizeBody: '1em',
    sizeLead: '1.1em',
    sizeControl: '1.25em',
    sizeDisplay: '3.1rem',
    sizeDisplayCompact: '2.25rem',
    sizeTitle: '1.5rem',
    sizeTitleCompact: '1.25rem',
    sizeHeading: '1.125rem',
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },
  radius: {
    small: '3px',
    medium: '6px',
    large: '14px',
    pill: '999px',
  },
  shadow: {
    soft: '0 1px 2px rgba(0, 0, 0, 0.08)',
    raised: '0 12px 30px rgba(0, 0, 0, 0.14)',
    focus: '0 0 0 3px rgba(122, 44, 183, 0.28)',
  },
  layout: {
    shell: '1126px',
    reading: '48rem',
    form: '32rem',
    cardTrack: '14rem',
  },
  breakpoints: {
    compact: 1024,
    mobile: 767,
  },
  zIndex: {
    dropdown: 2,
    backdrop: 8,
    drawer: 9,
  },
}

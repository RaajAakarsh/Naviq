/**
 * Design Tokens - JavaScript/TypeScript constants that mirror CSS variables
 * Use these for dynamic styling and JavaScript-based animations
 */

export const BRAND_COLORS = {
  skyBlue: '#14ddda',
  butterCream: '#fffbe8', 
  charcoalGreen: '#2b3738',
  neonRed: '#ff4655',
  earthBrown: '#5e3933',
  oceanBlue: '#3291ab',
  toxicMint: '#03fcad',
} as const;

export const THEME_COLORS = {
  background: 'hsl(186 25% 19%)',
  foreground: 'hsl(48 83% 96%)',
  primary: 'hsl(180 84% 46%)',
  primaryForeground: 'hsl(186 25% 19%)',
  secondary: 'hsl(163 97% 50%)',
  secondaryForeground: 'hsl(186 25% 19%)',
  accent: 'hsl(354 100% 64%)',
  accentForeground: 'hsl(48 83% 96%)',
  card: 'hsl(186 25% 21%)',
  cardForeground: 'hsl(48 83% 96%)',
  border: 'hsl(186 25% 30%)',
  input: 'hsl(186 25% 25%)',
} as const;

export const EFFECTS = {
  glassBg: 'rgba(43, 55, 56, 0.8)',
  glassBorder: 'rgba(20, 221, 218, 0.2)',
  glowPrimary: '0 0 20px rgba(20, 221, 218, 0.3)',
  glowAccent: '0 0 20px rgba(255, 70, 85, 0.3)',
} as const;

export const SPACING = {
  messageGap: '0.5rem',
  panelPadding: '1.5rem',
  buttonPadding: '0.75rem 1.5rem',
} as const;

export const BORDER_RADIUS = {
  default: '0.5rem',
  message: '1rem',  
  panel: '0.75rem',
  button: '0.5rem',
} as const;

export const ANIMATIONS = {
  transition: 'all 0.2s ease-in-out',
  fastTransition: 'all 0.1s ease-in-out',
  slowTransition: 'all 0.3s ease-in-out',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  toast: 1100,
  tooltip: 1200,
} as const;
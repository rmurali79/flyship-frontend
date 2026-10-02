/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // App neutrals, tinted to the PeerPost navy (hue 255) so every gray-* utility in the app
        // matches the brand: gray-900 is the dark page ink, gray-800 the dark card surface.
        gray: {
          50: 'oklch(0.985 0.003 255 / <alpha-value>)',
          100: 'oklch(0.965 0.006 255 / <alpha-value>)',
          200: 'oklch(0.925 0.010 255 / <alpha-value>)',
          300: 'oklch(0.870 0.014 255 / <alpha-value>)',
          400: 'oklch(0.710 0.020 255 / <alpha-value>)',
          500: 'oklch(0.560 0.025 255 / <alpha-value>)',
          600: 'oklch(0.450 0.030 255 / <alpha-value>)',
          700: 'oklch(0.320 0.030 255 / <alpha-value>)',
          800: 'oklch(0.225 0.030 255 / <alpha-value>)',
          900: 'oklch(0.170 0.030 255 / <alpha-value>)',
          950: 'oklch(0.130 0.030 255 / <alpha-value>)',
        },
        // Theme-aware: values live in src/index.css (light on :root, dark on .dark).
        peerpost: {
          ink: 'oklch(var(--pp-ink) / <alpha-value>)',
          surface: 'var(--pp-surface)',
          border: 'var(--pp-border)',
          borderStrong: 'var(--pp-border-strong)',
          heading: 'oklch(var(--pp-heading) / <alpha-value>)',
          body: 'oklch(var(--pp-body) / <alpha-value>)',
          muted: 'oklch(var(--pp-muted) / <alpha-value>)',
          faint: 'oklch(var(--pp-faint) / <alpha-value>)',
          gold: 'oklch(var(--pp-gold) / <alpha-value>)',
          goldHover: 'oklch(var(--pp-gold-hover) / <alpha-value>)',
          goldInk: 'oklch(var(--pp-gold-ink) / <alpha-value>)',
          teal: 'oklch(var(--pp-teal) / <alpha-value>)',
        },
      },
      fontFamily: {
        // App default (font-sans): Manrope for text. font-display (Space Grotesk) for headings,
        // font-mono (JetBrains Mono) for figures: codes, amounts, dates, references.
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Newsreader', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        // No fill-mode: the panel ends with no transform, so fixed-position dialogs inside it
        // still position against the viewport.
        'drawer-in': 'drawerIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translate(-50%, 20px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        drawerIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

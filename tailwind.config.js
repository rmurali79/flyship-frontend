/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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

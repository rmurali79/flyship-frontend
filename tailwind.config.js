/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        peerpost: {
          ink: 'oklch(0.17 0.03 255)',
          surface: 'oklch(0.20 0.03 255)',
          border: 'oklch(1 0 0 / 0.08)',
          borderStrong: 'oklch(1 0 0 / 0.12)',
          heading: 'oklch(0.97 0.01 95)',
          body: 'oklch(0.82 0.02 255)',
          muted: 'oklch(0.62 0.02 255)',
          faint: 'oklch(0.58 0.02 255)',
          gold: 'oklch(0.80 0.15 85)',
          goldHover: 'oklch(0.88 0.12 85)',
          goldInk: 'oklch(0.14 0.03 255)',
          teal: 'oklch(0.80 0.15 170)',
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

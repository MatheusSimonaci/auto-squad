import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: '#060a12',
          surface: '#0c1220',
          'surface-2': '#111827',
          border: '#1e293b',
          'border-glow': 'rgba(6, 182, 212, 0.3)',
          cyan: '#06b6d4',
          'cyan-bright': '#22d3ee',
          blue: '#3b82f6',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
          'text-dim': '#475569',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

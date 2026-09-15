/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      /* ── 语义化颜色 tokens ── */
      colors: {
        surface: {
          DEFAULT:    '#f9fafb', // gray-50
          card:       '#ffffff',
          hover:      '#f3f4f6', // gray-100
          input:      '#f3f4f6',
          accent:     '#eef2ff', // indigo-50
        },
        content: {
          DEFAULT:    '#374151', // gray-700
          title:      '#111827', // gray-900
          heading:    '#1f2937', // gray-800
          muted:      '#6b7280', // gray-500
          faint:      '#9ca3af', // gray-400
        },
        brand: {
          DEFAULT:    '#4338ca', // indigo-700
          hover:      '#3730a3', // indigo-800
          light:      '#e0e7ff', // indigo-100
          bg:         '#eef2ff', // indigo-50
          text:       '#4f46e5', // indigo-600
        },
        border: {
          DEFAULT:    '#e5e7eb', // gray-200
          strong:     '#d1d5db', // gray-300
          card:       '#f3f4f6', // gray-100
        },
        callout: {
          tip:        { bg: '#f0fdf4', border: '#10b981', text: '#065f46' },
          note:       { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
          warning:    { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
          template:   { bg: '#faf5ff', border: '#8b5cf6', text: '#5b21b6' },
          mistake:    { bg: '#fffbeb', border: '#f59e0b', text: '#78350f' },
        },
      },

      /* ── 间距 tokens ── */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      /* ── 圆角 tokens ── */
      borderRadius: {
        card:   '0.75rem',  // 12px
        'card-sm': '0.5rem', // 8px
        input:  '0.375rem', // 6px
      },

      /* ── 阴影 tokens ── */
      boxShadow: {
        card:     '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};

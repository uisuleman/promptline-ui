/**
 * Promptline UI — Tailwind preset
 * tailwind.config.js → presets: [require('./tailwind.preset.js')]
 *
 * TYPE SCALE (size / line-height) — the only sizes components use:
 *   text-2xs 11/16  · labels in dense UI (badges, kbd)
 *   text-xs  12/16  · meta, captions, timestamps
 *   text-sm  13/20  · secondary UI text, buttons (sm), menus
 *   text-base 14/20 · default UI text, buttons, inputs
 *   text-md  15/24  · chat message body (reading text)
 *   text-lg  16/24  · emphasised body
 *   text-xl  18/28  · card / dialog titles
 *   text-2xl 20/28  · section titles
 *   text-3xl 24/32  · page titles
 *   text-4xl 30/36  · display
 * SPACING — 4px grid (Tailwind default): 1=4 2=8 3=12 4=16 5=20 6=24 8=32 10=40 12=48
 * HEIGHTS — controls: 28 (xs) · 32 (sm) · 36 (md, default) · 40 (lg)
 */
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: c('bg'), surface: c('surface'), 'surface-2': c('surface-2'),
        border: c('border'), 'border-strong': c('border-strong'),
        fg: c('fg'), 'fg-muted': c('fg-muted'), 'fg-subtle': c('fg-subtle'),
        accent: c('accent'), 'accent-fg': c('accent-fg'),
        success: c('success'), warning: c('warning'), danger: c('danger'), info: c('info'),
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '20px' }],
        base: ['14px', { lineHeight: '20px' }],
        md: ['15px', { lineHeight: '24px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '2xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.015em' }],
        '3xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '4xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        xs: 'var(--radius-xs)', sm: 'var(--radius-sm)', DEFAULT: 'var(--radius-md)', md: 'var(--radius-md)',
        lg: 'var(--radius-lg)', xl: 'var(--radius-xl)',
      },
      boxShadow: { xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', DEFAULT: 'var(--shadow-md)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' },
      fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
      transitionTimingFunction: { out: 'var(--ease-out)' },
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors that extend the theme
        'shop-blue': '#2196f3',
        'shop-pink': '#ff4081',
        'shop-light-blue': '#42a5f5',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      transitionDuration: {
        '600': '600ms',
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "light",
      {
        shoppingstore: {
          // Primary - Main brand color (blue)
          primary: "#2196f3",
          "primary-content": "#ffffff",

          // Secondary - Accent color (pink)
          secondary: "#ff4081",
          "secondary-content": "#ffffff",

          // Accent (same as secondary for consistency)
          accent: "#ff4081",
          "accent-content": "#ffffff",

          // Neutral tones
          neutral: "#3d4451",
          "neutral-content": "#ffffff",

          // Base colors (backgrounds)
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          "base-300": "#e9ecef",
          "base-content": "#212529",

          // Semantic colors
          info: "#3abff8",
          "info-content": "#002b3d",
          success: "#36d399",
          "success-content": "#003320",
          warning: "#fbbd23",
          "warning-content": "#382800",
          error: "#f87272",
          "error-content": "#470000",
        },
      },
    ],
  },
};

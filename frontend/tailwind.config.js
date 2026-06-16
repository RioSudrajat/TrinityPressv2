/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1117",
        surface: "#1C1F2A",
        surfaceElevated: "#252836",
        borderHalus: "#2E3347",
        accentPrimary: "#5B8CFF",    // Nearest-Neighbor (Blue)
        accentSecondary: "#A78BFA",  // Chroma Subsampling (Lavender)
        accentTertiary: "#34D399",   // SVD (Mint)
        textMain: "#F0F2FF",
        textSec: "#8B90A8",
        textLabel: "#5A6070",
        error: "#F87171",
        warning: "#FBBF24",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

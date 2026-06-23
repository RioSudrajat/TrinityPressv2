/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F3F3F3",
        surface: "#FFFFFF",
        surfaceElevated: "#E5E5E5",
        borderHalus: "#D4D4D4",
        brandPrimary: "#ABF600",
        brandSecondary: "#F2FED1",
        accentPrimary: "#2563EB",    // Nearest-Neighbor (Royal Blue)
        accentSecondary: "#7C3AED",  // JPEG Quality (Violet)
        accentTertiary: "#059669",   // SVD (Emerald)
        textMain: "#111111",
        textSec: "#404040",
        textLabel: "#737373",
        error: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Karla", "sans-serif"],
        display: ["Karla", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "24px",
        xl: "32px",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

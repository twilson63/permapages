/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        // the serif voice shared with published pages — permanent documents
        display: ["'Iowan Old Style'", "'Palatino Linotype'", "Palatino", "Georgia", "serif"],
        sans: ["system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        // "permapress": a print studio for permanent documents.
        // warm paper, ink text, archival ledger-green accent.
        permapress: {
          primary: "#1F6F50",
          "primary-content": "#FBFBF8",
          secondary: "#16181D",
          "secondary-content": "#FBFBF8",
          accent: "#1F6F50",
          "accent-content": "#FBFBF8",
          neutral: "#16181D",
          "neutral-content": "#FBFBF8",
          "base-100": "#FBFBF8",
          "base-200": "#F1F0EA",
          "base-300": "#E4E2D8",
          "base-content": "#16181D",
          info: "#31577D",
          success: "#1F6F50",
          warning: "#9A6A00",
          error: "#9E2B25",
          "--rounded-btn": "999px",
          "--rounded-box": "0.75rem",
        },
      },
    ],
    logs: false,
  },
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core ink / paper
        coal: "#1B1B18",
        ink: "#1B1B18",
        inkSoft: "#4A453D",
        muted: "#83786C",
        paper: "#F7F4EE",
        surface: "#FFFFFF",
        line: "#E6DFD1",
        lineSoft: "#EFEAE0",

        // Accents
        saffron: "#C9922F",
        indigoInk: "#8C4A24",
        basil: "#1F6F5C",
        basilTint: "#E1EFE8",
        pomegranate: "#A63A2E",
        amazonOrange: "#B5592A",
        amazonOrangeDark: "#8C441F",
        amazonGold: "#D9A441",
        accentTint: "#F4E3D3",

        // Legacy dark surface tokens (footer / dark blocks)
        amazonNavy: "#1B1B18",
        amazonBlue: "#232f3e",
        amazonLight: "#37475a"
      },
      boxShadow: {
        brass: "0 2px 10px rgba(181, 89, 42, 0.18)",
        panel: "0 1px 2px rgba(27, 27, 24, 0.06), 0 1px 1px rgba(27, 27, 24, 0.04)",
        dropdown: "0 10px 30px rgba(27, 27, 24, 0.14)"
      },
      fontFamily: {
        amazon: ["var(--font-body)", "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      maxWidth: {
        amazon: "1500px"
      }
    }
  },
  plugins: []
};

export default config;

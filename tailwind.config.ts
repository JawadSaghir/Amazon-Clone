import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coal: "#0f1111",
        paper: "#eaeded",
        saffron: "#febd69",
        indigoInk: "#007185",
        basil: "#067d62",
        pomegranate: "#b12704",
        amazonNavy: "#131921",
        amazonBlue: "#232f3e",
        amazonLight: "#37475a",
        amazonOrange: "#ff9900",
        amazonGold: "#ffd814"
      },
      boxShadow: {
        brass: "0 2px 5px rgba(213, 217, 217, 0.5)",
        panel: "0 1px 3px rgba(15, 17, 17, 0.15)",
        dropdown: "0 4px 14px rgba(15, 17, 17, 0.25)"
      },
      fontFamily: {
        amazon: ['"Amazon Ember"', "Arial", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      maxWidth: {
        amazon: "1500px"
      }
    }
  },
  plugins: []
};

export default config;

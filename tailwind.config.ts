import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coal: "#171412",
        paper: "#f7f1e8",
        saffron: "#e8a528",
        indigoInk: "#183153",
        basil: "#16725b",
        pomegranate: "#b83232"
      },
      boxShadow: {
        brass: "0 18px 45px rgba(69, 50, 25, 0.16)",
        panel: "0 10px 30px rgba(23, 20, 18, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

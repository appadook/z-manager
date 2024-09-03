import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'navy-900': '#0f172a',
        'navy-800': '#1e293b',
        'navy-700': '#334155',
        'navy-600': '#475569',
        'navy-500': '#64748b',
        'navy-300': '#cbd5e1', 
      },
    },
  },
  plugins: [],
};
export default config;

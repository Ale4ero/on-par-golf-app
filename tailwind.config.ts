import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        accent: "var(--accent)",
        cream: "#f1f4d8",
        sage: {
          50: '#f5f7f4',
          100: '#e8ede5',
          200: '#d1dbc9',
          300: '#b0c29f',
          400: '#8ca377',
          500: '#6b7e5a',
          600: '#5a6b4a',
          700: '#3d4a32',
          800: '#2d3a2e',
          900: '#1a221b',
          950: '#0d110e',
        },
        olive: {
          50: '#fdfbf4',
          100: '#f5f3ed',
          200: '#e8e4d6',
          300: '#d4cdb5',
          400: '#b5a989',
          500: '#8f8363',
          600: '#6b6047',
          700: '#4d4533',
          800: '#3a3426',
          900: '#2d2a1f',
        },
      },
    },
  },
  plugins: [],
};
export default config;

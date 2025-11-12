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
        cream: "var(--cream)",
        sage: {
          50: '#f5f7f4',
          100: '#e8ede5',
          200: '#d1dbc9',
          300: '#b0c29f',
          400: '#8ca377',
          500: '#6b7e5a',
          600: '#5a6b4a',
          700: '#4a5a3d',
          800: '#3d4a32',
          900: '#2d3a2e',
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

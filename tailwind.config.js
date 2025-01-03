/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#030711",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#7C3AED", // vibrant purple
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1E293B",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        card: {
          DEFAULT: "rgba(17, 24, 39, 0.7)",
          foreground: "#ffffff",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(17, 24, 39, 0) 70%)',
      },
    },
  },
  plugins: [],
} 
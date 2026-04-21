/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        /* Brand palette */
        "wp-red": "#d5241d",
        "wp-red-dark": "#b71d17",
        "wp-black": "#1c1c1c",
        "wp-slate": "#52717a",
        "wp-cream": "#f5f5f3",
        /* Semantic aliases used throughout components */
        ink: "#1c1c1c",
        shell: "#f5f5f3",
        steel: "#52717a",
        ember: "#d5241d",
        /* Tailwind CSS variable tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 16px 0 rgba(28,28,28,0.07), 0 1px 3px 0 rgba(28,28,28,0.04)"
      },
      backgroundImage: {
        /* CSS grid pattern used in steel cards */
        "brand-grid":
          "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)"
      },
      animation: {
        marquee: "marquee 30s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate(0)" },
          "100%": { transform: "translate(-50%)" }
        }
      }
    }
  },
  plugins: []
};

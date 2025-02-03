// tailwind config is required for editor support
import {heroui} from "@heroui/react";
import type { Config } from "tailwindcss";
import tailwindcssAnimated from "tailwindcss-animated";

const config: Pick<Config, "content" | "presets" | "theme" | "plugins" | "darkMode"> = {
  content: [
    "./src/styles/**/*.css",
    "./src/app/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/pages/**/*.tsx",
    "./src/layouts/**/*.tsx",
    "./src/sections/**/*.tsx",
    "./src/containers/**/*.tsx",
    "./src/styles/**/*.css",
    "./src/providers/**/*.tsx",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A7BED3",
          hover: "#96ADC2",
          light: "#C6E2E9",
          lighter: "#F1F8E9",
        },
        text: {
          DEFAULT: "#333333",
          secondary: "#666666",
          light: "#999999",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        "heading-1": [
          "2.5rem",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
          },
        ],
        "heading-2": [
          "2rem",
          {
            lineHeight: "1.3",
            letterSpacing: "-0.01em",
          },
        ],
        body: [
          "1rem",
          {
            lineHeight: "1.5",
          },
        ],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      // borderRadius: {
      //   lg: "var(--radius)",
      //   md: "calc(var(--radius) - 2px)",
      //   sm: "calc(var(--radius) - 4px)",
      // },
    },
  },
  darkMode: "class",
  plugins: [heroui(), tailwindcssAnimated],
};

export default config;

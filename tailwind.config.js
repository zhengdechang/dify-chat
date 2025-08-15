/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--pfchat-border))",
        input: "hsl(var(--pfchat-input))",
        ring: "hsl(var(--pfchat-ring))",
        background: "hsl(var(--pfchat-background))",
        foreground: "hsl(var(--pfchat-foreground))",
        primary: {
          DEFAULT: "hsl(var(--pfchat-primary))",
          foreground: "hsl(var(--pfchat-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--pfchat-secondary))",
          foreground: "hsl(var(--pfchat-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--pfchat-destructive))",
          foreground: "hsl(var(--pfchat-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--pfchat-muted))",
          foreground: "hsl(var(--pfchat-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--pfchat-accent))",
          foreground: "hsl(var(--pfchat-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--pfchat-popover))",
          foreground: "hsl(var(--pfchat-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--pfchat-card))",
          foreground: "hsl(var(--pfchat-card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--pfchat-radius)",
        md: "calc(var(--pfchat-radius) - 2px)",
        sm: "calc(var(--pfchat-radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        typing: {
          "0%, 60%": { opacity: "1" },
          "30%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        typing: "typing 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

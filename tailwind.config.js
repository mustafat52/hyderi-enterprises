/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E7E0CE",
        "paper-deep": "#DCD3BB",
        card: "#FBF8F0",
        ink: "#262218",
        "ink-soft": "#7A7157",
        "ink-faint": "#A79E86",
        rule: "#C7BC9E",
        "rule-soft": "#D9D0B7",
        barn: "#99372A",
        "barn-ink": "#6E2419",
        teal: "#1F5C58",
        "teal-ink": "#143E3B",
        marigold: "#B97A1C",
        sage: "#55703F",
        denim: "#3C5D78",
        shop: "#B97A1C",
        godown: "#3C5D78",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

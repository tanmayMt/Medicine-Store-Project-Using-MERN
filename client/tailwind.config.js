/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: true, // Enable Preflight now that Bootstrap is removed
  },
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        poppins: ['"Poppins"', "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.55s ease-out both",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}



